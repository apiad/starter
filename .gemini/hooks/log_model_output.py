#!/usr/bin/env python3
import sys
import json
import os

# Configuration
LOG_FILE = os.getenv("GEMINI_LOG_FILE", "gemini.log")

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"decision": "allow"}))
            return

        data = json.loads(input_data)
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

        print(json.dumps({"decision": "allow"}))

    except Exception:
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
