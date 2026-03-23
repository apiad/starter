import os
try:
    import tomllib as toml
except ImportError:
    import toml # Fallback for older python although project says 3.12+

def test_reviewer_agent_exists():
    assert os.path.exists(".gemini/agents/reviewer.md")

def test_editor_agent_gone():
    assert not os.path.exists(".gemini/agents/editor.md")

def test_review_command_exists():
    assert os.path.exists(".gemini/commands/review.toml")

def test_revise_command_gone():
    assert not os.path.exists(".gemini/commands/revise.toml")

def test_reviewer_agent_is_valid_markdown():
    with open(".gemini/agents/reviewer.md", "r") as f:
        content = f.read()
    assert "reviewer" in content.lower()
    # Check for name in YAML frontmatter or title
    assert "name: reviewer" in content or "# Reviewer" in content

def test_review_command_is_valid_toml():
    with open(".gemini/commands/review.toml", "rb") as f:
        config = toml.load(f)
    assert "description" in config
    assert "prompt" in config
    assert "reviewer" in config["prompt"].lower()

def test_maintenance_command_is_audit():
    with open(".gemini/commands/maintenance.toml", "rb") as f:
        config = toml.load(f)
    assert "codebase_investigator" in config["prompt"]
    assert "Maintenance Report Card" in config["prompt"]

def test_planner_agent_read_only():
    with open(".gemini/agents/planner.md", "r") as f:
        content = f.read()
    assert "planner" in content.lower()
    assert "read" in content.lower()

def test_writer_agent_exists():
    assert os.path.exists(".gemini/agents/writer.md")

def test_reporter_agent_gone():
    assert not os.path.exists(".gemini/agents/reporter.md")

def test_draft_command_is_multimode():
    with open(".gemini/commands/draft.toml", "rb") as f:
        config = toml.load(f)
    assert "writer" in config["prompt"].lower()

if __name__ == "__main__":
    test_reviewer_agent_exists()
    test_editor_agent_gone()
    test_review_command_exists()
    test_revise_command_gone()
    test_reviewer_agent_is_valid_markdown()
    test_review_command_is_valid_toml()
    test_maintenance_command_is_audit()
    test_planner_agent_read_only()
    test_writer_agent_exists()
    test_reporter_agent_gone()
    test_draft_command_is_multimode()
    print("Tests Passed")
