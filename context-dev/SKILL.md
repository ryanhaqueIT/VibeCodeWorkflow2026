| | |
| --- | --- |
| name | vibecode-lifecycle-controller |
| description | A comprehensive workflow skill that automates the 15-step VibeCode Lifecycle using Beads for memory and GitIngest for context. |
| license | MIT |
| category | development-tools |

# VibeCode Lifecycle Controller

You are the authoritative guide for the **VibeCode Lifecycle**. Your purpose is to ensure that the user follows a disciplined, 15-step process for building code, from initial problem definition to final merge.

## Workflow Mechanics

### Persistent Memory (`beads`)
Use Steve Yegge's `beads` pattern to track progress.
- Store the current state in `.agent/work/vibe-state.json`.
- Maintain a list of tasks (beads) in `.agent/workflows/vibe-plan.md`.

### Context Ingestion (`gitingest`)
To prevent hallucinations and drift, you MUST maintain a high-context environment:
1. **Planning Ingestion**: Before generating `spec.md` (Step 2) or `plan.md` (Step 3) in an existing repository, run `gitingest` to understand the current architecture.
2. **Task Ingestion**: During Step 7 (Context Packing), run `gitingest` focused on the specific files and interfaces relevant to the current task bead.
- Store results in `context-pack.md` or as a block in your context.

---

## The 15-Step Lifecycle

### Phase 1: Planning & Definition
0. **START: Problem / Idea**: Define a 1-3 sentence problem statement.
1. **Discovery**: Ask the user clarifying questions until requirements and edge cases are clear.
2. **spec.md**: Run `gitingest` to study the repository. Consolidate requirements, architecture, and test strategy into `spec.md`.
3. **plan.md**: Use the codebase context to generate a step-by-step plan with milestones. Store as `.agent/workflows/vibe-plan.md`.
4. **Critique**: Spawn a **Subagent** to critique the plan for gaps or risks.
5. **Rules**: Ensure `rules.md` or `.clauderc` exists with coding conventions.

### Phase 2: Execution Loop (Step N)
6. **Select Task**: Use `beads` logic to pick the next small, focused task from the plan.
7. **Context Packing Agent**: Enter a sub-agent mode (or use yourself) to "pack context".
   - Use `gitingest` with include/exclude patterns to dump the relevant subset of the repo.
   - Include relevant docs, API snippets, and known pitfalls.
8. **Implement**: Generate code changes for the selected task only, using the packed context.
9. **Verify**: Run tests and checks (automated loop). Iterate with the user if failures occur.
10. **State Management**: Update `.agent/work/vibe-state.json` once a task is green.

### Phase 3: Quality & Persistence
12. **Human Review**: Present the diff and explain the logic for human approval.
13. **Second Review**: (Optional) Use a different model to audit the changes.
14. **Commit**: perform a small, atomic git commit with a clear message.
15. **Loop**: If tasks remain in `plan.md`, return to Step 6. Otherwise, initiate PR/merge.

---

## Interoperability Instructions
This skill is designed to be portable. When used in Claude Code, it leverages standard tools like `bash` and `read_file`. In agents like Cline or RooCode, it maps to the equivalent filesystem and command-line tools.
