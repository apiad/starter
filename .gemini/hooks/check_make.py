#!/usr/bin/env python3
import json
import subprocess

def main():
    try:
        # Run make command using uv run to ensure dependencies are available
        result = subprocess.run(
            ["uv", "run", "make"],
            capture_output=True,
            text=True,
            check=False
        )

        if result.returncode != 0:
            # make failed
            error_message = result.stdout + "\n" + result.stderr
            output = {
                "decision": "deny",
                "reason": (
                    f"Validation failed (make returned {result.returncode}).\n"
                    "Please fix the broken tests or linting issues.\n"
                    "Output of 'make':\n"
                    "```\n" + error_message.strip() + "\n```\n"
                    "Fix these issues and ensure 'make' passes before continuing."
                )
            }
        else:
            # make passed
            output = {"decision": "allow"}

        print(json.dumps(output))

    except Exception:
        # If the hook itself fails, we allow but could log to stderr
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
