import os

def test_coder_agent_exists():
    assert os.path.exists(".gemini/agents/coder.md")

def test_coder_agent_has_full_tools():
    with open(".gemini/agents/coder.md", "r") as f:
        content = f.read()
    assert "write_file" in content
    assert "replace" in content
    assert "run_shell_command" in content

def test_coder_agent_has_mantra():
    with open(".gemini/agents/coder.md", "r") as f:
        content = f.read()
    assert "Red" in content
    assert "Green" in content
    assert "Verify" in content
