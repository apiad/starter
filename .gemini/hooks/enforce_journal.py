#!/usr/bin/env python3
import sys
import json
import subprocess
from datetime import datetime

def get_modified_files():
    """Returns a list of modified files using git status."""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            check=True
        )
        files = []
        for line in result.stdout.splitlines():
            if line.strip():
                # Format: 'M path/to/file' or '?? path/to/file'
                files.append(line[3:].strip())
        return files
    except Exception:
        return []

def main():
    try:
        modified_files = get_modified_files()
        output = {"decision": "allow"}

        # Check if there are changes other than journal/changelog
        significant_changes = [
            f for f in modified_files
            if f != "CHANGELOG.md" and not f.startswith("journal/")
        ]

        today = datetime.now().strftime("%Y-%m-%d")
        updates = [
            f for f in modified_files
            if f == "CHANGELOG.md" or f == f"journal/{today}.md"
        ]

        if significant_changes and not updates:
            output = {
                "decision": "deny",
                "reason": (
                    "Please update CHANGELOG.md and add a one-line entry to journal/" + today + ".md "
                    "describing the changes you just made. Do not stop until these files are updated."
                    "If necessary, update GEMINI.md with extra details that are relevant for the future,"
                    " such as specific project stack, tooling, practices, etc."
                )
            }

        print(json.dumps(output))

    except Exception:
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
