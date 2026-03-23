import os

def test_reviewer_agent_exists():
    assert os.path.exists(".gemini/agents/reviewer.md")

def test_editor_agent_gone():
    assert not os.path.exists(".gemini/agents/editor.md")

def test_review_command_exists():
    assert os.path.exists(".gemini/commands/review.toml")

def test_revise_command_gone():
    assert not os.path.exists(".gemini/commands/revise.toml")

def test_reviewer_agent_has_grep_search():
    with open(".gemini/agents/reviewer.md", "r") as f:
        content = f.read()
    assert "grep_search" in content

def test_review_command_is_multiphase():
    with open(".gemini/commands/review.toml", "r") as f:
        content = f.read()
    assert "Phase 1" in content
    assert "Phase 2" in content
    assert "Phase 3" in content
    assert "reviewer" in content

def test_draft_command_suggests_review():
    with open(".gemini/commands/draft.toml", "r") as f:
        content = f.read()
    assert "/review" in content
    assert "/revise" not in content

def test_docs_updated():
    files_to_check = ["README.md", ".gemini/style-guide.md", "docs/user-guide.md", "docs/design.md"]
    for f_path in files_to_check:
        with open(f_path, "r") as f:
            content = f.read()
        assert "review" in content.lower()
        assert "reviewer" in content.lower()
        assert "writer" in content.lower()
        assert "reporter" not in content.lower()

def test_writer_agent_exists():
    assert os.path.exists(".gemini/agents/writer.md")

def test_reporter_agent_gone():
    assert not os.path.exists(".gemini/agents/reporter.md")

def test_writer_agent_has_replace():
    with open(".gemini/agents/writer.md", "r") as f:
        content = f.read()
    assert "replace" in content

def test_draft_command_is_multimode():
    with open(".gemini/commands/draft.toml", "r") as f:
        content = f.read()
    assert "Refinement" in content
    assert "Initial Drafting" in content
    assert "writer" in content
    assert "reporter" not in content

def test_maintenance_command_is_audit():
    with open(".gemini/commands/maintenance.toml", "r") as f:
        content = f.read()
    assert "codebase_investigator" in content
    assert "Maintenance Report Card" in content
    assert "research/maintainance-report-" in content
    assert "Phase 3" in content
    # Ensure it doesn't mention Step-by-Step Implementation or modification
    assert "Step-by-Step Implementation" not in content

def test_planner_agent_read_only():
    with open(".gemini/agents/planner.md", "r") as f:
        content = f.read()
    assert "planner" in content.lower()
    assert "read-only" in content.lower()

def test_plan_command_persistence_responsibility():
    with open(".gemini/commands/plan.toml", "r") as f:
        content = f.read()
    assert "Command Responsibility" in content
    assert "responsible for saving the plan" in content.lower()
    assert "planner" in content.lower()
    assert "agent" in content.lower()
    assert "read-only" in content.lower()

if __name__ == "__main__":
    # Simple manual runner for now
    try:
        print("Checking reviewer agent exists...")
        test_reviewer_agent_exists()
        print("Checking editor agent gone...")
        test_editor_agent_gone()
        print("Checking review command exists...")
        test_review_command_exists()
        print("Checking revise command gone...")
        test_revise_command_gone()
        print("Checking reviewer agent has grep_search...")
        test_reviewer_agent_has_grep_search()
        print("Checking review command is multi-phase...")
        test_review_command_is_multiphase()
        print("Checking draft command suggests review...")
        test_draft_command_suggests_review()
        print("Checking docs updated...")
        test_docs_updated()
        
        print("Checking writer agent exists...")
        test_writer_agent_exists()
        print("Checking reporter agent gone...")
        test_reporter_agent_gone()
        print("Checking writer agent has replace...")
        test_writer_agent_has_replace()
        print("Checking draft command is multi-mode...")
        test_draft_command_is_multimode()

        print("Checking maintenance command is audit...")
        test_maintenance_command_is_audit()
        print("Checking planner agent is read-only...")
        test_planner_agent_read_only()
        print("Checking plan command persistence responsibility...")
        test_plan_command_persistence_responsibility()
        
        print("Tests Passed")
    except AssertionError as e:
        print(f"Test Failed: {e}")
        exit(1)
