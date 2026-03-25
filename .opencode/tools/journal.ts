import { tool } from "@opencode-ai/plugin";

interface JournalEntry {
  timestamp: string;
  message: string;
}

interface JournalData {
  date: string;
  entries: JournalEntry[];
}

const JOURNAL_DIR = "journal";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getJournalPath(date: string): string {
  return `${JOURNAL_DIR}/${date}.yaml`;
}

async function loadJournal(date: string): Promise<JournalData> {
  const path = getJournalPath(date);
  const file = Bun.file(path);
  if (!await file.exists()) {
    return { date, entries: [] };
  }
  const content = await file.text();
  if (!content.trim()) {
    return { date, entries: [] };
  }
  return parseYaml(content, date);
}

function parseYaml(content: string, date: string): JournalData {
  const lines = content.split("\n");
  const data: JournalData = { date, entries: [] };
  let inEntries = false;

  for (const line of lines) {
    if (line.startsWith("date:")) {
      const match = line.match(/date: "(.+)"/);
      if (match) data.date = match[1];
    } else if (line.startsWith("entries:")) {
      inEntries = true;
    } else if (inEntries && line.match(/^  - timestamp:/)) {
      const match = line.match(/timestamp: "(.+)"/);
      if (match) {
        data.entries.push({ timestamp: match[1], message: "" });
      }
    } else if (inEntries && line.match(/^    message:/) && data.entries.length > 0) {
      const match = line.match(/message: "(.+)"/);
      if (match) {
        data.entries[data.entries.length - 1].message = match[1];
      }
    }
  }

  return data;
}

function toYaml(data: JournalData): string {
  const lines: string[] = [];
  lines.push(`date: "${data.date}"`);
  lines.push("entries:");
  for (const entry of data.entries) {
    lines.push(`  - timestamp: "${entry.timestamp}"`);
    lines.push(`    message: "${entry.message}"`);
  }
  return lines.join("\n") + "\n";
}

export default tool({
  description: "Manage journal entries. Actions: add (add entry for today), list (show today's entries)",
  args: {
    action: tool.schema.string().describe("Action: add or list"),
    message: tool.schema.string().optional().describe("Journal entry message (for add)"),
  },
  async execute(args) {
    const action = args.action || "add";
    const now = new Date();
    const timestamp = now.toISOString();
    const today = now.toISOString().split("T")[0];

    if (action === "list") {
      const data = await loadJournal(today);
      if (data.entries.length === 0) {
        return `No journal entries for ${today}`;
      }
      let output = `# Journal - ${today}\n\n`;
      for (const entry of data.entries) {
        const time = entry.timestamp.split("T")[1].split(".")[0];
        output += `- [${time}] ${entry.message}\n`;
      }
      return output;
    }

    const message = args.message;
    if (!message) {
      return "Error: --message is required for add action";
    }

    const data = await loadJournal(today);
    data.entries.push({ timestamp, message });
    await Bun.write(getJournalPath(today), toYaml(data));
    return `Added journal entry: [${timestamp}] - ${message}`;
  },
});
