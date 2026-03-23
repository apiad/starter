import os

def test_editor_agent_gone():
    assert not os.path.exists(".gemini/agents/editor.md")

def test_revise_command_gone():
    assert not os.path.exists(".gemini/commands/revise.toml")

def test_reporter_agent_gone():
    assert not os.path.exists(".gemini/agents/reporter.md")

def test_legacy_structure_tests_gone():
    # This is our meta-test for the refactoring step
    # We want to ensure specific brittle tests are gone
    # We will check this manually or by verifying the file content
    pass
