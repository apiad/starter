# /note Command

Create structured notes from raw thoughts.

## Usage

```
/note <your raw thoughts>
```

## How It Works

The model runs the `note` CLI tool:

1. **Create**: `uv run note create --content "..."`
2. **Review**: Model presents structured note
3. **Iterate**: Re-run with modifications if needed
4. **Save**: `uv run note save --content "..." --filename "name"`

## CLI Tool

**Location**: `.opencode/bin/note`

**Commands**:

```bash
# Structure content into note
uv run note create --content "Your thoughts..."

# Save to file
uv run note save --content "..." --filename "name"

# List existing notes
uv run note list

# Search notes
uv run note search --query "auth"
```

## Example

```
User: /note "I was thinking about auth flow. We need OAuth2."

Model: uv run note create --content "I was thinking about auth flow..."

Output:
{
  "id": "2026-03-27-abc123",
  "title": "Auth Flow Thoughts",
  "created": "2026-03-27",
  "type": "note",
  "tags": ["auth"],
  "filename": "auth-flow-thoughts"
}

Model: Here's your note with tags: auth. Save as "auth-flow-thoughts"?

User: Yes

Model: uv run note save --content "..." --filename "auth-flow-thoughts"
```

Notes saved to: `.knowledge/notes/<filename>.md`
