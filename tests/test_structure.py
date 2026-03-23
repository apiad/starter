import os
import tomllib
import pytest

def get_commands():
    path = ".gemini/commands/"
    return [os.path.join(path, f) for f in os.listdir(path) if f.endswith(".toml")]

def get_agents():
    path = ".gemini/agents/"
    return [os.path.join(path, f) for f in os.listdir(path) if f.endswith(".md")]

@pytest.mark.parametrize("cmd_path", get_commands())
def test_command_structure(cmd_path):
    with open(cmd_path, "rb") as f:
        config = tomllib.load(f)
    
    assert "description" in config
    assert isinstance(config["description"], str)
    assert len(config["description"].strip()) > 0
    
    assert "prompt" in config
    assert isinstance(config["prompt"], str)
    assert len(config["prompt"].strip()) > 0

@pytest.mark.parametrize("agent_path", get_agents())
def test_agent_structure(agent_path):
    agent_name = os.path.basename(agent_path).replace(".md", "")
    with open(agent_path, "r") as f:
        content = f.read()
    
    # Check for name in content (case-insensitive)
    assert agent_name.lower() in content.lower()
    
    # Check for some basic structure (e.g. name: or # Title)
    assert f"name: {agent_name}" in content.lower() or f"# {agent_name}" in content.lower()
