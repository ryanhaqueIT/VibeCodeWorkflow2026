# Technical Roadmap: Automating the VibeCode Lifecycle

To transform your `README.md` into a "live" automated skill that others can follow, you need to transition from **Static Instructions** to **Tool-Enabled Orchestration**.

## 1. The Core "Toolbox" (MCP Infrastructure)

The primary way to automate the workflow is to equip the agent with specific Model Context Protocol (MCP) servers.

### A. Context Packing: `trelis-gitingest-mcp`
- **Why**: Automates Step 7 (Context Packing).
- **Implementation**: Install via `npx @trelis/trelis-gitingest-mcp`. The agent can then call the `gitingest` tool directly with filters.

### B. State Management: `beads` Implementation
- **Why**: Automates Steps 3 & 6 (Planning & Task Selection).
- **Implementation**:
    - **Option 1 (CLI)**: Use a small Node/Python script that enforces the `beads.md` format.
    - **Option 2 (MCP)**: Create a `beads-mcp` server that provides tools like `add_bead`, `list_beads`, and `mark_bead_complete`. 

### C. Critique/Review: `subagent-tool`
- **Why**: Automates Steps 4 & 13.
- **Implementation**: Use the built-in subagent capabilities (like in Claude Code or Antigravity) to spawn specialized roles (e.g., "Performance Reviewer").

---

## 2. Distributed Skill Setup (`SKILL.md`)

To share this with others, you should package it as a **Skill Folder**:

```text
vibecode-skill/
├── SKILL.md          # The master controller (I have drafted this for you)
├── beads_schema.json # Defines the structure for the beads.md
├── scripts/          # Helper scripts for git-ingest or test running
└── package.json      # Metadata and dependency listing (if MCP)
```

---

## 3. Implementation Phases

### Phase I: The "Controller" (Active now)
We use the `SKILL.md` to define the "VibeCode Agent" persona. This person enforces the 15-step rule strictly.

### Phase II: The "Bead Plan" Generator
We need to automate Step 3. Instead of the AI just writing markdown, we want it to call a tool:
- `create_bead_plan(goal)` -> Generates the task list with dependencies.

### Phase III: The "Context Agent"
Automate Step 7. When the AI switches to a new task:
- `ingest_task_context(task_id)` -> Automatically runs `gitingest` on the files listed in that bead.

---

## Immediate Next Steps for You

1. **Install GitIngest MCP**: Run `npm install -g @trelis/trelis-gitingest-mcp` to give your agent the context-packing tool.
2. **Define Bead Format**: Confirm if you want to use a simple `beads.md` file (which I can manage) or if you want to build a dedicated MCP for it.
3. **Publish to `.agent/workflows`**: I have already done this for you locally! You can now test it by running `/vibe-lifecycle`.
