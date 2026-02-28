#!/usr/bin/env python3
"""
Hook to display a customized welcome message at the start of a session.

This hook is triggered on session 'startup', 'resume', or 'clear'.
It fetches project info from pyproject.toml and current git status.
"""
import json
import subprocess
import sys
import os
import tomllib

# Add the hooks directory to path for importing utils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import utils

def get_project_info():
    """
    Retrieves project name and description from pyproject.toml.
    
    Returns:
        tuple: (name, description) or ("Unknown", "No description available.").
    """
    try:
        with open("pyproject.toml", "rb") as f:
            data = tomllib.load(f)
            project = data.get("project", {})
            return project.get("name", "Unknown"), project.get("description", "No description available.")
    except Exception:
        return "Unknown", "No description available."

def main():
    """
    Main entry point for the welcome message hook.
    
    Reads stdin and returns JSON response with a systemMessage containing project context.
    """
    # Read stdin though we don't strictly need it for this simple message
    try:
        json.load(sys.stdin)
    except Exception:
        pass

    name, description = get_project_info()
    git_status_str = utils.get_git_status_short()
    
    if git_status_str:
        status_msg = f"⚠️  Uncommitted changes:\n{git_status_str}"
    else:
        status_msg = "✅ Working tree is clean."

    message_lines = [
        f"🚀 Welcome to Gemini CLI for `{name}`",
        f"📝 {description}",
        " ",
        "📊 Git Status:",
        status_msg,
        " ",
        "🛠️  Available Commands:",
        "- `/scaffold`: Scaffold a new project.",
        "- `/task`: Manage tasks, create, update, or work.",
        "- `/commit`: Prepare and commit changes.",
        "- `/maintainance`: Project maintenance tasks.",
        "- `/docs`: Update project documentation.",
        "- `/release`: Run release workflow.",
        "- `/research`: Perform deep research on a topic.",
        " ",
        "💡 Tip: Run `/onboard` for a brief explanation of the project.",
    ]

    system_message = "\n".join(message_lines)

    hook_output = {
        "additionalContext": (
            f"The user has started a Gemini CLI session for the project '{name}'. "
            f"Description: {description}. Git Status: {status_msg}"
        )
    }

    utils.send_hook_decision(
        "allow", 
        system_message=system_message,
        hook_output=hook_output
    )

if __name__ == "__main__":
    main()
