#!/usr/bin/env python3
import sys
import json
import os
import subprocess
from datetime import datetime

# Configuration
LOG_FILE = os.getenv("GEMINI_LOG_FILE", "gemini.log")

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
        input_data = sys.stdin.read()
        if not input_data:
            data = {}
        else:
            data = json.loads(input_data)

        event = data.get("hook_event_name")
        output = {"decision": "allow"}

        if event == "SessionStart":
            with open(LOG_FILE, "w", encoding="utf-8") as f:
                f.write(f"--- Session Started ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')}) ---\n\n")

        elif event == "AfterModel":
            llm_response = data.get("llm_response", {})
            candidates = llm_response.get("candidates", [])
            if candidates:
                candidate = candidates[0]
                content_obj = candidate.get("content", {})
                parts = content_obj.get("parts", [])
                finish_reason = candidate.get("finishReason")

                if parts or finish_reason:
                    with open(LOG_FILE, "a", encoding="utf-8") as f:
                        for part in parts:
                            if isinstance(part, str):
                                f.write(part)
                            elif isinstance(part, dict) and "text" in part:
                                f.write(part["text"])
                        if finish_reason:
                            f.write("\n\n")

        elif event == "AfterAgent":
            modified_files = get_modified_files()

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
        # Fallback to allow if anything fails
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
