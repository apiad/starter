#!/usr/bin/env bash
# Test: Verify .opencode is a git submodule pointing to opencode-core

set -e

REPO_DIR="/home/apiad/Projects/personal/opencode"

echo "=== Submodule Verification Test ==="

# Check 1: .gitmodules exists
echo -n "Checking .gitmodules exists... "
if [[ ! -f "$REPO_DIR/.gitmodules" ]]; then
    echo "FAIL: .gitmodules not found"
    exit 1
fi
echo "OK"

# Check 2: .gitmodules contains opencode-core reference
echo -n "Checking .gitmodules has opencode-core... "
if ! grep -q "opencode-core" "$REPO_DIR/.gitmodules"; then
    echo "FAIL: opencode-core not in .gitmodules"
    exit 1
fi
echo "OK"

# Check 3: .gitmodules has correct path (".opencode")
echo -n "Checking submodule path is .opencode... "
if ! grep -q 'path = \.opencode' "$REPO_DIR/.gitmodules"; then
    echo "FAIL: submodule path not set to .opencode"
    exit 1
fi
echo "OK"

# Check 4: .gitmodules has correct url
echo -n "Checking submodule URL... "
if ! grep -q "github.com/apiad/opencode-core" "$REPO_DIR/.gitmodules"; then
    echo "FAIL: incorrect submodule URL"
    exit 1
fi
echo "OK"

# Check 5: .opencode is not in .gitignore anymore (it's a submodule now)
echo -n "Checking .opencode NOT in .gitignore... "
if grep -q '^\.opencode/' "$REPO_DIR/.gitignore" 2>/dev/null; then
    echo "FAIL: .opencode/ is still in .gitignore"
    exit 1
fi
echo "OK"

# Check 6: .opencode directory exists and has content
echo -n "Checking .opencode/ has content... "
if [[ ! -d "$REPO_DIR/.opencode" ]]; then
    echo "FAIL: .opencode/ directory not found"
    exit 1
fi
FILE_COUNT=$(find "$REPO_DIR/.opencode" -type f | wc -l)
if [[ "$FILE_COUNT" -lt 10 ]]; then
    echo "FAIL: .opencode/ has only $FILE_COUNT files (expected 20+)"
    exit 1
fi
echo "OK ($FILE_COUNT files)"

# Check 7: .git/modules/.opencode exists (submodule metadata)
echo -n "Checking .git/modules/.opencode exists... "
if [[ ! -d "$REPO_DIR/.git/modules/.opencode" ]]; then
    echo "FAIL: submodule metadata not found"
    exit 1
fi
echo "OK"

# Check 8: .opencode is registered as submodule in index
echo -n "Checking git submodule status... "
if ! git -C "$REPO_DIR" submodule status 2>/dev/null | grep -q "opencode"; then
    echo "FAIL: submodule not registered"
    exit 1
fi
echo "OK"

echo ""
echo "=== All submodule checks passed ==="
