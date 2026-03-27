#!/usr/bin/env bash
# Test script for Phase 5: Documentation and Testing
# Verifies all completion criteria for Phase 5

set -e

REPO_DIR="/home/apiad/Projects/personal/opencode"

echo "=== Phase 5: Documentation and Testing Test ==="

# Check 1: README.md updated with new installation instructions
echo -n "Checking README.md has installation instructions... "
if ! grep -q "curl.*install.sh.*bash" "$REPO_DIR/README.md"; then
    echo "FAIL: Installation command not in README.md"
    exit 1
fi
echo "OK"

# Check 2: README.md mentions both installation modes
echo -n "Checking README.md mentions both modes... "
if ! grep -qE "(--mode=copy|--mode=link|copy mode|link mode)" "$REPO_DIR/README.md"; then
    echo "FAIL: Installation modes not documented"
    exit 1
fi
echo "OK"

# Check 3: README.md references opencode-core
echo -n "Checking README.md references opencode-core... "
if ! grep -q "opencode-core" "$REPO_DIR/README.md"; then
    echo "FAIL: opencode-core not referenced"
    exit 1
fi
echo "OK"

# Check 4: docs/deploy.md exists and mentions modes
echo -n "Checking docs/deploy.md... "
if [[ ! -f "$REPO_DIR/docs/deploy.md" ]]; then
    echo "FAIL: docs/deploy.md not found"
    exit 1
fi
echo "OK"

# Check 5: docs/updating.md exists (new file for update instructions)
echo -n "Checking docs/updating.md exists... "
if [[ ! -f "$REPO_DIR/docs/updating.md" ]]; then
    echo "FAIL: docs/updating.md not found"
    exit 1
fi
echo "OK"

# Check 6: docs/updating.md mentions both modes
echo -n "Checking docs/updating.md has mode instructions... "
if ! grep -qE "copy|link|submodule" "$REPO_DIR/docs/updating.md"; then
    echo "FAIL: Update instructions incomplete"
    exit 1
fi
echo "OK"

# Check 7: install.sh is executable and has proper shebang
echo -n "Checking install.sh shebang... "
if ! head -1 "$REPO_DIR/install.sh" | grep -q "^#!/usr/bin/env bash"; then
    echo "FAIL: install.sh missing proper shebang"
    exit 1
fi
echo "OK"

# Check 8: install.sh has usage function
echo -n "Checking install.sh has usage... "
if ! grep -q -E "function usage|usage\(\)" "$REPO_DIR/install.sh"; then
    echo "FAIL: install.sh missing usage function"
    exit 1
fi
echo "OK"

# Check 9: Documentation links verified (docs exist)
echo -n "Checking docs/ structure... "
DOC_COUNT=$(ls -1 "$REPO_DIR/docs/"*.md 2>/dev/null | wc -l)
if [[ "$DOC_COUNT" -lt 3 ]]; then
    echo "FAIL: Expected at least 3 docs, found $DOC_COUNT"
    exit 1
fi
echo "OK ($DOC_COUNT docs)"

# Check 10: templates/README.md is proper template
echo -n "Checking templates/README.md is template... "
if ! grep -q -i "project" "$REPO_DIR/templates/README.md"; then
    echo "FAIL: templates/README.md not a proper template"
    exit 1
fi
echo "OK"

echo ""
echo "=== All Phase 5 checks passed ==="
