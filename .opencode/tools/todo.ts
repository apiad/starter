import { tool } from "@opencode-ai/plugin";

interface Task {
  id: string;
  label: string;
  description: string;
  category: string;
  status: "todo" | "in_progress" | "done" | "cancelled";
  complexity: number;
  dependencies: string[];
  planPath?: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksData {
  tasks: Task[];
}

const TASKS_FILE = "todo.yaml";

async function loadTasks(): Promise<TasksData> {
  const file = Bun.file(TASKS_FILE);
  if (!await file.exists()) {
    return { tasks: [] };
  }
  const content = await file.text();
  if (!content.trim()) {
    return { tasks: [] };
  }
  return parseYaml(content);
}

function parseYaml(content: string): TasksData {
  const lines = content.split("\n");
  const tasks: Task[] = [];
  let currentTask: Partial<Task> | null = null;
  let inTasks = false;

  for (const line of lines) {
    if (line.startsWith("tasks:")) {
      inTasks = true;
      continue;
    }
    if (inTasks && line.match(/^  - id:/)) {
      if (currentTask && currentTask.id) {
        tasks.push(currentTask as Task);
      }
      currentTask = { dependencies: [] };
      const match = line.match(/id: "(.+)"/);
      if (match) currentTask.id = match[1];
    } else if (inTasks && currentTask) {
      if (line.match(/^    id:/)) {
        const match = line.match(/id: "(.+)"/);
        if (match) currentTask.id = match[1];
      } else if (line.match(/^    label:/)) {
        const match = line.match(/label: "(.+)"/);
        if (match) currentTask.label = match[1];
      } else if (line.match(/^    description:/)) {
        const match = line.match(/description: "(.+)"/);
        if (match) currentTask.description = match[1];
      } else if (line.match(/^    category:/)) {
        const match = line.match(/category: "(.+)"/);
        if (match) currentTask.category = match[1];
      } else if (line.match(/^    status:/)) {
        const match = line.match(/status: (.+)/);
        if (match) currentTask.status = match[1].trim() as Task["status"];
      } else if (line.match(/^    complexity:/)) {
        const match = line.match(/complexity: (\d+)/);
        if (match) currentTask.complexity = parseInt(match[1]);
      } else if (line.match(/^    dependencies:/)) {
        currentTask.dependencies = [];
      } else if (line.match(/^      - /) && currentTask.dependencies) {
        currentTask.dependencies.push(line.match(/^      - (.+)/)?.[1] || "");
      } else if (line.match(/^    planPath:/)) {
        const match = line.match(/planPath: "(.+)"/);
        if (match) currentTask.planPath = match[1];
      } else if (line.match(/^    createdAt:/)) {
        const match = line.match(/createdAt: "(.+)"/);
        if (match) currentTask.createdAt = match[1];
      } else if (line.match(/^    updatedAt:/)) {
        const match = line.match(/updatedAt: "(.+)"/);
        if (match) currentTask.updatedAt = match[1];
      }
    }
  }
  if (currentTask && currentTask.id) {
    tasks.push(currentTask as Task);
  }
  return { tasks };
}

function toYaml(data: TasksData): string {
  const lines: string[] = ["tasks:"];
  for (const task of data.tasks) {
    lines.push(`  - id: "${task.id}"`);
    lines.push(`    label: "${task.label}"`);
    lines.push(`    description: "${task.description}"`);
    lines.push(`    category: "${task.category}"`);
    lines.push(`    status: ${task.status}`);
    lines.push(`    complexity: ${task.complexity}`);
    if (task.dependencies.length > 0) {
      lines.push(`    dependencies:`);
      for (const dep of task.dependencies) {
        lines.push(`      - ${dep}`);
      }
    } else {
      lines.push(`    dependencies: []`);
    }
    if (task.planPath) {
      lines.push(`    planPath: "${task.planPath}"`);
    }
    lines.push(`    createdAt: "${task.createdAt}"`);
    lines.push(`    updatedAt: "${task.updatedAt}"`);
  }
  return lines.join("\n") + "\n";
}

function generateId(tasks: Task[], category: string): string {
  const prefix = category.charAt(0).toUpperCase();
  let maxNum = 0;
  for (const task of tasks) {
    if (task.id.startsWith(prefix + ".")) {
      const num = parseInt(task.id.split(".")[1]);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `${prefix}.${maxNum + 1}`;
}

function topologicalSort(tasks: Task[]): Task[] {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const task of tasks) {
    inDegree.set(task.id, 0);
    adj.set(task.id, []);
  }

  for (const task of tasks) {
    for (const depId of task.dependencies) {
      if (taskMap.has(depId)) {
        adj.get(depId)!.push(task.id);
        inDegree.set(task.id, inDegree.get(task.id)! + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }
  queue.sort();

  const sorted: Task[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    sorted.push(taskMap.get(id)!);
    for (const neighbor of adj.get(id)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
        queue.sort();
      }
    }
  }
  return sorted;
}

function formatList(tasks: Task[]): string {
  const active = tasks.filter((t) => t.status !== "done" && t.status !== "cancelled");
  const archived = tasks.filter((t) => t.status === "done" || t.status === "cancelled");

  let output = "# Tasks\n\n";

  if (active.length === 0) {
    output += "## Active Tasks\nNo active tasks.\n\n";
  } else {
    output += "## Active Tasks\n";
    const byCategory = new Map<string, Task[]>();
    for (const task of active) {
      const cat = task.category || "General";
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(task);
    }
    for (const [cat, catTasks] of [...byCategory.entries()].sort()) {
      output += `\n### ${cat}\n`;
      for (const task of topologicalSort(catTasks)) {
        const deps = task.dependencies.length > 0 ? ` [Deps: ${task.dependencies.join(", ")}]` : "";
        const plan = task.planPath ? ` (See plan: ${task.planPath})` : "";
        const statusIcon = task.status === "in_progress" ? "[/]" : "[ ]";
        output += `- ${statusIcon} **${task.id}** ${task.label}: ${task.description}${deps}${plan}\n`;
      }
    }
  }

  if (archived.length > 0) {
    output += "\n## Archive\n";
    const byCategory = new Map<string, Task[]>();
    for (const task of archived) {
      const cat = task.category || "General";
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(task);
    }
    for (const [cat, catTasks] of [...byCategory.entries()].sort()) {
      output += `\n### ${cat}\n`;
      for (const task of catTasks.sort((a, b) => a.id.localeCompare(b.id))) {
        const statusIcon = task.status === "done" ? "[x]" : "[-]";
        output += `- ${statusIcon} **${task.id}** ${task.label}: ${task.description}\n`;
      }
    }
  }

  return output;
}

export default tool({
  description: "Manage tasks in todo.yaml. Actions: add, start, cancel, archive, attach-plan, list",
  args: {
    action: tool.schema.string().describe("Action: add, start, cancel, archive, attach-plan, or list"),
    taskId: tool.schema.string().optional().describe("Task ID (for start, cancel, archive, attach-plan)"),
    label: tool.schema.string().optional().describe("Task label (for add)"),
    description: tool.schema.string().optional().describe("Task description (for add)"),
    category: tool.schema.string().optional().describe("Task category (for add, default: General)"),
    complexity: tool.schema.number().optional().describe("Task complexity 0-10 (for add, default: 0)"),
    dependencies: tool.schema.string().optional().describe("Comma-separated task IDs (for add)"),
    planPath: tool.schema.string().optional().describe("Plan path to attach (for add or attach-plan)"),
  },
  async execute(args) {
    const action = args.action;
    const now = new Date().toISOString();

    if (action === "list") {
      const data = await loadTasks();
      return formatList(data.tasks);
    }

    if (!action || action === "add") {
      if (!args.label) {
        return "Error: --label is required for add action";
      }
      const data = await loadTasks();
      const newTask: Task = {
        id: generateId(data.tasks, args.category || "General"),
        label: args.label,
        description: args.description || "",
        category: args.category || "General",
        status: "todo",
        complexity: args.complexity ?? 0,
        dependencies: args.dependencies ? args.dependencies.split(",").map((d) => d.trim()).filter(Boolean) : [],
        planPath: args.planPath,
        createdAt: now,
        updatedAt: now,
      };
      data.tasks.push(newTask);
      await Bun.write(TASKS_FILE, toYaml(data));
      return `Added task: ${newTask.id} ${newTask.label}`;
    }

    if (!args.taskId) {
      return "Error: --task-id is required for this action";
    }

    const data = await loadTasks();
    const task = data.tasks.find((t) => t.id === args.taskId);
    if (!task) {
      return `Error: Task ${args.taskId} not found`;
    }

    switch (action) {
      case "start":
        task.status = "in_progress";
        task.updatedAt = now;
        await Bun.write(TASKS_FILE, toYaml(data));
        return `Started task: ${task.id}`;

      case "cancel":
        task.status = "cancelled";
        task.updatedAt = now;
        await Bun.write(TASKS_FILE, toYaml(data));
        return `Cancelled task: ${task.id}`;

      case "archive":
        task.status = "done";
        task.updatedAt = now;
        await Bun.write(TASKS_FILE, toYaml(data));
        return `Archived task: ${task.id}`;

      case "attach-plan":
        if (!args.planPath) {
          return "Error: --plan-path is required for attach-plan action";
        }
        task.planPath = args.planPath;
        task.updatedAt = now;
        await Bun.write(TASKS_FILE, toYaml(data));
        return `Attached plan ${args.planPath} to task: ${task.id}`;

      default:
        return `Unknown action: ${action}. Use: add, start, cancel, archive, attach-plan, list`;
    }
  },
});
