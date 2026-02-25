#!/usr/bin/env python3
import json
import os
from datetime import datetime

# Configuration
LOG_FILE = os.getenv("GEMINI_LOG_FILE", "gemini.log")

def main():
    try:
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            f.write(f"--- Session Started ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')}) ---")

        # Always allow session start
        print(json.dumps({"decision": "allow"}))
    except Exception:
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
