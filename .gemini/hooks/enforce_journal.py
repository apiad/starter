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

        today = datetime.now().strftime("%Y-%m-%d")
        journal_file = f"journal/{today}.md"

        # Check if there are changes other than the daily journal
        significant_changes = [
            f for f in modified_files
            if f != journal_file
        ]

        # Check if the daily journal was updated
        journal_updated = journal_file in modified_files

        if significant_changes and not journal_updated:
            output = {
                "decision": "deny",
                "reason": (
                    f"Please add a one-line entry to {journal_file} "
                    "describing the changes you just made. Do not stop until this file is updated."
                )
            }

        print(json.dumps(output))

    except Exception:
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
