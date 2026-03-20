#!/usr/bin/env python3
import os
import subprocess
import sys
from datetime import date

def run_command(command):
    result = subprocess.run(command, capture_output=True, text=True, shell=True)
    return result

def main():
    today = date.today().strftime("%Y-%m-%d")
    journal_path = f"journal/{today}.md"
    
    # Scan for changes (staged, modified, untracked)
    # git ls-files --modified --others --exclude-standard
    res = run_command("git ls-files --modified --others --exclude-standard")
    changed_files = res.stdout.strip().splitlines()
    
    if not changed_files:
        return 0
    
    # Calculate max(mtime) for all changed files (excluding .gemini/ and the journal)
    meaningful_changes = [f for f in changed_files if not f.startswith(".gemini/") and f != journal_path]
    
    if not meaningful_changes:
        return 0
    
    max_mtime = 0
    for f in meaningful_changes:
        if os.path.exists(f):
            mtime = os.path.getmtime(f)
            if mtime > max_mtime:
                max_mtime = mtime
    
    # Check journal mtime
    if not os.path.exists(journal_path):
        print(f"Error: Updated journal required ({journal_path} does not exist)")
        return 1
    
    journal_mtime = os.path.getmtime(journal_path)
    
    if journal_mtime < max_mtime:
        print("Error: Updated journal required (Today's journal must be the most recently modified file)")
        return 1
    
    # Run make
    print("Running validation (make test)...")
    res = run_command("make test")
    if res.returncode != 0:
        print("Validation failed:")
        print(res.stdout)
        print(res.stderr)
        return res.returncode
    
    print("Validation passed.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
