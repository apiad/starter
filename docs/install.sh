#!/usr/bin/env bash
set -euo pipefail

VERSION="2.0.0"
REPO_URL="https://github.com/apiad/opencode-core.git"
FRAMEWORK_DIR=".opencode"
INSTALL_JSON="opencode.json"
JOURNAL_FILE="${HOME}/.opencode/install.log"
DEPS_LOCK_FILE="${HOME}/.opencode/deps.lock"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" >> "${JOURNAL_FILE}"
}

info() { echo -e "${BLUE}[INFO]${NC} $*"; log "INFO" "$*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; log "OK" "$*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; log "WARN" "$*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; log "ERROR" "$*"; }

usage() {
    cat << EOF
${BOLD}OpenCode Framework Installer v${VERSION}${NC}

${BOLD}USAGE:${NC}
    install.sh [OPTIONS]

${BOLD}OPTIONS:${NC}
    --mode=MODE        Installation mode: 'copy' (default) or 'link'
    --version          Show version information
    --help, -h         Show this help message
    --update           Update existing installation

${BOLD}MODES:${NC}
    copy               Download and extract framework (default)
                       Removes .git/ directory from installation
                       Safe: does not modify your git history

    link               Add framework as git submodule
                       Keeps .git/ connection for easy updates
                       Recommended for development

${BOLD}EXAMPLES:${NC}
    curl -fsSL https://apiad.github.io/opencode/install.sh | bash
    curl -fsSL https://apiad.github.io/opencode/install.sh | bash -s -- --mode=copy
    curl -fsSL https://apiad.github.io/opencode/install.sh | bash -s -- --mode=link

${BOLD}FILES:${NC}
    .opencode/         Framework directory
    opencode.json      Installation metadata and configuration

EOF
}

check_prerequisites() {
    if ! command -v git &>/dev/null; then
        error "Git is not installed. Please install git first."
        exit 1
    fi
    if ! command -v curl &>/dev/null; then
        if command -v wget &>/dev/null; then
            warn "curl not found, but wget is available"
        else
            error "Neither curl nor wget is installed. Please install one of them."
            exit 1
        fi
    fi
}

get_package_manager() {
    if command -v bun &>/dev/null; then
        echo "bun"
    elif command -v npm &>/dev/null; then
        echo "npm"
    elif command -v pnpm &>/dev/null; then
        echo "pnpm"
    elif command -v yarn &>/dev/null; then
        echo "yarn"
    else
        warn "No Node.js package manager found. Skipping dependency installation."
        return 1
    fi
}

backup_configs() {
    local configs=("${INSTALL_JSON}" "style-guide.md")
    declare -A backups

    for config in "${configs[@]}"; do
        if [[ -f "${config}" ]]; then
            backups["${config}"]=$(mktemp)
            cp "${config}" "${backups[${config}]}"
            info "Backed up existing ${config}"
        fi
    done

    printf '%s\n' "${!backups[@]}" > /tmp/opencode_config_files
    for config in "${!backups[@]}"; do
        echo "${config}:${backups[${config}]}" >> /tmp/opencode_config_map
    done
}

restore_configs() {
    if [[ -f /tmp/opencode_config_map ]]; then
        while IFS=: read -r config backup; do
            if [[ -f "${backup}" ]]; then
                cp "${backup}" "${config}"
                info "Restored ${config}"
            fi
        done < /tmp/opencode_config_map
        rm -f /tmp/opencode_config_files /tmp/opencode_config_map
    fi
}

install_copy_mode() {
    local tag="${1:-v${VERSION}}"
    local temp_dir
    temp_dir=$(mktemp -d)

    info "Installing OpenCode Framework (copy mode)..."
    info "Cloning repository tag ${tag}..."

    if command -v git &>/dev/null; then
        git clone --depth 1 --branch "${tag}" "${REPO_URL}" "${temp_dir}/opencode-core" 2>&1 | while IFS= read -r line; do
            info "  ${line}"
        done
    fi

    if [[ ! -d "${temp_dir}/opencode-core" ]]; then
        error "Failed to clone repository"
        rm -rf "${temp_dir}"
        exit 1
    fi

    if [[ -d "${FRAMEWORK_DIR}" ]]; then
        warn "Removing existing ${FRAMEWORK_DIR}..."
        rm -rf "${FRAMEWORK_DIR}"
    fi

    mv "${temp_dir}/opencode-core" "${FRAMEWORK_DIR}"

    if [[ -d "${FRAMEWORK_DIR}/.git" ]]; then
        info "Removing .git directory..."
        rm -rf "${FRAMEWORK_DIR}/.git"
    fi

    rm -rf "${temp_dir}"
    success "Framework copied to ${FRAMEWORK_DIR}/"
}

install_link_mode() {
    local tag="${1:-v${VERSION}}"

    info "Installing OpenCode Framework (link mode)..."
    info "Adding framework as git submodule..."

    if [[ -d "${FRAMEWORK_DIR}" ]]; then
        if git submodule status "${FRAMEWORK_DIR}" &>/dev/null 2>&1; then
            warn "Submodule already exists, updating..."
            git submodule update --remote --merge "${FRAMEWORK_DIR}" 2>&1 | while IFS= read -r line; do
                info "  ${line}"
            done
        else
            error "${FRAMEWORK_DIR} exists but is not a submodule"
            exit 1
        fi
    else
        git submodule add -b "${tag}" "${REPO_URL}" "${FRAMEWORK_DIR}" 2>&1 | while IFS= read -r line; do
            info "  ${line}"
        done
    fi

    success "Framework linked as git submodule at ${FRAMEWORK_DIR}/"
}

create_opencode_json() {
    local mode="${1}"
    local install_date
    install_date=$(date '+%Y-%m-%dT%H:%M:%SZ')
    local commit_hash
    commit_hash=$(git -C "${FRAMEWORK_DIR}" rev-parse --short HEAD 2>/dev/null || echo "unknown")

    if [[ -f "${INSTALL_JSON}" ]]; then
        info "Updating ${INSTALL_JSON}..."
    else
        info "Creating ${INSTALL_JSON}..."
    fi

    cat > "${INSTALL_JSON}" << EOF
{
  "name": "opencode",
  "version": "${VERSION}",
  "installed": "${install_date}",
  "mode": "${mode}",
  "commit": "${commit_hash}",
  "repository": "${REPO_URL}",
  "config": {
    "frameworkPath": "${FRAMEWORK_DIR}"
  }
}
EOF
    success "Created ${INSTALL_JSON}"
}

install_framework_deps() {
    local pm
    pm=$(get_package_manager) || return 0

    info "Installing framework dependencies using ${pm}..."

    if [[ ! -f "${FRAMEWORK_DIR}/package.json" ]]; then
        warn "No package.json found in framework"
        return 0
    fi

    local lock_file=".${pm}.lock"
    if [[ -f "${DEPS_LOCK_FILE}" ]]; then
        local last_pm
        last_pm=$(cat "${DEPS_LOCK_FILE}")
        if [[ "${last_pm}" == "${pm}" ]]; then
            info "Dependencies already installed with ${pm}"
            return 0
        fi
    fi

    (
        cd "${FRAMEWORK_DIR}" || exit 1
        case "${pm}" in
            bun)
                bun install 2>&1 | while IFS= read -r line; do
                    info "  ${line}"
                done
                ;;
            npm)
                npm install 2>&1 | while IFS= read -r line; do
                    info "  ${line}"
                done
                ;;
            pnpm)
                pnpm install 2>&1 | while IFS= read -r line; do
                    info "  ${line}"
                done
                ;;
            yarn)
                yarn install 2>&1 | while IFS= read -r line; do
                    info "  ${line}"
                done
                ;;
        esac
    )

    echo "${pm}" > "${DEPS_LOCK_FILE}"
    success "Dependencies installed"
}

handle_update() {
    local mode="${1}"
    local tag="${2:-v${VERSION}}"

    if [[ ! -d "${FRAMEWORK_DIR}" ]]; then
        return 1
    fi

    if [[ -f "${INSTALL_JSON}" ]]; then
        local installed_mode
        installed_mode=$(grep -o '"mode"[[:space:]]*:[[:space:]]*"[^"]*"' "${INSTALL_JSON}" | sed 's/.*"\([^"]*\)"/\1/')

        if [[ "${installed_mode}" != "${mode}" ]]; then
            warn "Existing installation uses '${installed_mode}' mode but you requested '${mode}' mode"
            echo -n "Switch modes? This will reinstall the framework. [y/N]: "
            read -r response
            if [[ ! "${response}" =~ ^[Yy]$ ]]; then
                info "Keeping existing installation"
                return 2
            fi
            backup_configs
            return 1
        fi

        info "Updating existing ${mode} installation to ${tag}..."
        if [[ "${mode}" == "copy" ]]; then
            backup_configs
            return 1
        else
            git submodule update --remote --merge "${FRAMEWORK_DIR}" 2>&1 | while IFS= read -r line; do
                info "  ${line}"
            done
            return 2
        fi
    fi

    return 1
}

cleanup() {
    rm -f /tmp/opencode_config_files /tmp/opencode_config_map 2>/dev/null || true
}

interactive_mode() {
    echo -e "${BOLD}OpenCode Framework Installer v${VERSION}${NC}"
    echo ""
    echo "Please select installation mode:"
    echo ""
    echo -e "  ${BOLD}[1]${NC} ${CYAN}copy${NC}     - Download and extract framework"
    echo "                Removes .git/ from installation"
    echo "                Safe: does not affect git history"
    echo ""
    echo -e "  ${BOLD}[2]${NC} ${CYAN}link${NC}     - Add as git submodule"
    echo "                Keeps .git/ connection for updates"
    echo "                Recommended for development"
    echo ""
    echo -ne "Select mode [1]: "
    read -r choice
    choice="${choice:-1}"

    case "${choice}" in
        1) echo "copy" ;;
        2) echo "link" ;;
        *) echo "copy" ;;
    esac
}

print_summary() {
    local mode="${1}"
    local tag="${2:-v${VERSION}}"

    echo ""
    echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${GREEN}  OpenCode Framework Installation Complete!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BOLD}Mode:${NC}    ${CYAN}${mode}${NC}"
    echo -e "  ${BOLD}Version:${NC} ${tag}"
    echo -e "  ${BOLD}Location:${NC} ${FRAMEWORK_DIR}/"
    echo ""
    echo -e "${BOLD}Next Steps:${NC}"
    echo ""
    if [[ "${mode}" == "copy" ]]; then
        echo "  1. cd ${FRAMEWORK_DIR}"
        echo "  2. Configure your settings in opencode.json"
        echo "  3. Run 'bun run dev' or 'npm run dev' to start"
        echo ""
        echo -e "  ${YELLOW}Note: To update, run the installer again${NC}"
    else
        echo "  1. cd ${FRAMEWORK_DIR}"
        echo "  2. Configure your settings in opencode.json"
        echo "  3. Run 'bun run dev' or 'npm run dev' to start"
        echo ""
        echo -e "  ${CYAN}Note: Update anytime with: git submodule update --remote --merge${NC}"
    fi
    echo ""
    echo -e "${BOLD}Documentation:${NC} ${FRAMEWORK_DIR}/README.md"
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
}

main() {
    mkdir -p "$(dirname "${JOURNAL_FILE}")" 2>/dev/null || true
    mkdir -p "${HOME}/.opencode" 2>/dev/null || true

    local mode=""
    local update=false
    local tag="v${VERSION}"

    for arg in "$@"; do
        case "${arg}" in
            --help|-h)
                usage
                exit 0
                ;;
            --version)
                echo "OpenCode Installer v${VERSION}"
                exit 0
                ;;
            --mode=*)
                mode="${arg#*=}"
                ;;
            --update)
                update=true
                ;;
            *)
                warn "Unknown option: ${arg}"
                ;;
        esac
    done

    check_prerequisites

    if [[ -z "${mode}" ]]; then
        mode=$(interactive_mode)
    fi

    if [[ "${mode}" != "copy" && "${mode}" != "link" ]]; then
        error "Invalid mode: ${mode}. Use 'copy' or 'link'"
        exit 1
    fi

    info "Starting OpenCode Framework installation..."
    info "Mode: ${mode}"
    info "Tag: ${tag}"

    if [[ "${update}" == "true" ]]; then
        local update_result
        update_result=$(handle_update "${mode}" "${tag}" || echo "$?")
        if [[ "${update_result}" == "2" ]]; then
            create_opencode_json "${mode}"
            install_framework_deps
            print_summary "${mode}" "${tag}"
            exit 0
        elif [[ "${update_result}" == "1" ]]; then
            :
        else
            backup_configs
        fi
    else
        if [[ -d "${FRAMEWORK_DIR}" ]]; then
            info "Existing installation detected"
            update_result=$(handle_update "${mode}" "${tag}" || echo "$?")
            if [[ "${update_result}" == "2" ]]; then
                create_opencode_json "${mode}"
                install_framework_deps
                print_summary "${mode}" "${tag}"
                exit 0
            elif [[ "${update_result}" == "1" ]]; then
                backup_configs
            fi
        fi
    fi

    case "${mode}" in
        copy)
            install_copy_mode "${tag}"
            ;;
        link)
            install_link_mode "${tag}"
            ;;
    esac

    restore_configs
    create_opencode_json "${mode}"
    install_framework_deps
    print_summary "${mode}" "${tag}"
    cleanup
}

main "$@"
