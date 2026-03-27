#!/usr/bin/env bash
# Test script for Phase 1: Create opencode-core Repository
# This verifies all completion criteria for Phase 1

set -e

CORE_DIR="/tmp/opencode-core"

echo "=== Phase 1 Completion Test ==="

# Check 1: Repository initialized with proper structure
echo -n "Checking directory structure... "
if [[ ! -d "$CORE_DIR/agents" ]]; then
    echo "FAIL: agents/ directory missing"
    exit 1
fi
if [[ ! -d "$CORE_DIR/commands" ]]; then
    echo "FAIL: commands/ directory missing"
    exit 1
fi
echo "OK"

# Check 2: All framework files copied from .opencode/
echo -n "Checking agent files (9 expected)... "
AGENT_COUNT=$(ls -1 "$CORE_DIR/agents/"*.md 2>/dev/null | wc -l)
if [[ "$AGENT_COUNT" -ne 9 ]]; then
    echo "FAIL: Expected 9 agent files, found $AGENT_COUNT"
    exit 1
fi
echo "OK ($AGENT_COUNT files)"

echo -n "Checking command files (13+ expected)... "
COMMAND_COUNT=$(ls -1 "$CORE_DIR/commands/"*.md 2>/dev/null | wc -l)
if [[ "$COMMAND_COUNT" -lt 13 ]]; then
    echo "FAIL: Expected 13+ command files, found $COMMAND_COUNT"
    exit 1
fi
echo "OK ($COMMAND_COUNT files)"

# Check 3: AGENTS.md relocated to instructions.md
echo -n "Checking AGENTS.md → instructions.md relocation... "
if [[ ! -f "$CORE_DIR/instructions.md" ]]; then
    echo "FAIL: instructions.md not found"
    exit 1
fi
echo "OK"

# Check 4: node_modules/ excluded from git (not in repo)
echo -n "Checking node_modules/ git exclusion... "
if [[ -d "$CORE_DIR/.git" ]] && [[ -d "$CORE_DIR/node_modules" ]]; then
    # Check if node_modules is tracked
    if git -C "$CORE_DIR" ls-files | grep -q "^node_modules"; then
        echo "FAIL: node_modules is tracked in git"
        exit 1
    fi
fi
echo "OK"

# Check 5: Repository tagged with v2.0.0
echo -n "Checking v2.0.0 tag exists... "
if [[ -d "$CORE_DIR/.git" ]]; then
    if ! git -C "$CORE_DIR" tag | grep -q "^v2.0.0$"; then
        echo "FAIL: v2.0.0 tag not found"
        exit 1
    fi
    echo "OK"
else
    echo "SKIP (no .git directory - local only)"
fi

# Check 6: README.md created
echo -n "Checking README.md exists... "
if [[ ! -f "$CORE_DIR/README.md" ]]; then
    echo "FAIL: README.md not found"
    exit 1
fi
echo "OK"

# Check 7: GitHub repository exists
echo -n "Checking GitHub repository exists... "
if ! gh repo view apiad/opencode-core &>/dev/null; then
    echo "FAIL: apiad/opencode-core repo not found on GitHub"
    exit 1
fi
echo "OK"

echo ""
echo "=== All Phase 1 checks passed ==="
