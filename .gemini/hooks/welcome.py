import json
import subprocess
import sys
import tomllib

def get_project_info():
    try:
        with open("pyproject.toml", "rb") as f:
            data = tomllib.load(f)
            project = data.get("project", {})
            return project.get("name", "Unknown"), project.get("description", "No description available.")
    except Exception:
        return "Unknown", "No description available."

def get_git_status():
    try:
        status = subprocess.check_output(["git", "status", "--short"], stderr=subprocess.STDOUT).decode().strip()
        if not status:
            return "✅ Working tree is clean."
        return f"""⚠️  Uncommitted changes:
{status}"""
    except Exception:
        return "❌ Could not determine git status."

def main():
    # Read stdin though we don't strictly need it for this simple message
    try:
        json.load(sys.stdin)
    except Exception:
        pass

    name, description = get_project_info()
    git_status = get_git_status()

    message_lines = [
        f"🚀 Welcome to Gemini CLI for `{name}`",
        f"📝 {description}",
        " ",
        "📊 Git Status:",
        git_status,
        " ",
        "🛠️  Available Commands:",
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

    response = {
        "systemMessage": system_message,
        "hookSpecificOutput": {
            "additionalContext": f"The user has started a Gemini CLI session for the project '{name}'. Description: {description}. Git Status: {git_status}"
        }
    }

    print(json.dumps(response))

if __name__ == "__main__":
    main()
