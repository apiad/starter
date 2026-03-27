#!/usr/bin/env bash
# Test script for Phase 3: Dual-Mode Installer (install.sh)
# Verifies all completion criteria for Phase 3

set -e

SCRIPT_DIR="/home/apiad/Projects/personal/opencode"
INSTALL_SH="$SCRIPT_DIR/install.sh"

echo "=== Phase 3: Dual-Mode Installer Test ==="

# Check 1: Script exists
echo -n "Checking install.sh exists... "
if [[ ! -f "$INSTALL_SH" ]]; then
    echo "FAIL: install.sh not found"
    exit 1
fi
echo "OK"

# Check 2: Script is executable
echo -n "Checking install.sh is executable... "
if [[ ! -x "$INSTALL_SH" ]]; then
    echo "FAIL: install.sh is not executable"
    exit 1
fi
echo "OK"

# Check 3: Script has required functions
echo -n "Checking required functions exist... "
for func in "install_copy_mode" "install_link_mode" "create_opencode_json" "install_framework_deps"; do
    if ! grep -q "function $func\|^$func()" "$INSTALL_SH"; then
        echo "FAIL: Function $func not found"
        exit 1
    fi
done
echo "OK"

# Check 4: Script supports --mode=copy
echo -n "Checking --mode=copy support... "
if ! grep -q "mode.*copy\|copy.*mode" "$INSTALL_SH"; then
    echo "FAIL: --mode=copy not documented"
    exit 1
fi
echo "OK"

# Check 5: Script supports --mode=link
echo -n "Checking --mode=link support... "
if ! grep -q "mode.*link\|link.*mode\|submodule" "$INSTALL_SH"; then
    echo "FAIL: --mode=link not documented"
    exit 1
fi
echo "OK"

# Check 6: Script handles updates
echo -n "Checking update handling... "
if ! grep -q "update\|upgrade\|existing" "$INSTALL_SH"; then
    echo "FAIL: Update handling not found"
    exit 1
fi
echo "OK"

# Check 7: Script creates opencode.json
echo -n "Checking opencode.json creation... "
if ! grep -q "opencode.json" "$INSTALL_SH"; then
    echo "FAIL: opencode.json creation not found"
    exit 1
fi
echo "OK"

# Check 8: Script references opencode-core repo
echo -n "Checking opencode-core repo reference... "
if ! grep -q "opencode-core" "$INSTALL_SH"; then
    echo "FAIL: opencode-core repo reference not found"
    exit 1
fi
echo "OK"

# Check 9: Script handles user config preservation
echo -n "Checking user config preservation... "
if ! grep -q "opencode.json\|preserve\|backup" "$INSTALL_SH"; then
    echo "FAIL: User config preservation not found"
    exit 1
fi
echo "OK"

# Check 10: Script has help/version info
echo -n "Checking help/version info... "
if ! grep -q -E "help|--help|version|--version" "$INSTALL_SH"; then
    echo "FAIL: Help/version info not found"
    exit 1
fi
echo "OK"

echo ""
echo "=== All Phase 3 checks passed ==="
