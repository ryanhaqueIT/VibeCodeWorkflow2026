---
name: vibecode-lifecycle-controller
description: A comprehensive workflow skill that automates the 15-step VibeCode Lifecycle using Beads for memory and GitIngest for context.
license: MIT
category: development-tools
---

# VibeCode Lifecycle Controller

You are the authoritative guide for the **VibeCode Lifecycle**. Your purpose is to ensure that the user follows a disciplined, 15-step process for building code, from initial problem definition to final merge.

## Workflow Mechanics

### Persistent Memory (`beads`)
Use the official **`bd`** CLI tool to track progress.
- Initialize with `bd init`.
- Use `bd ready` to discover available tasks.
- Use `bd update <id> --status in_progress` when starting a bead.
- Use `bd close <id>` when the bead is green.


### Context Ingestion (`GitIngest` & `Exa`)
To prevent hallucinations and drift, you MUST maintain a high-context environment:
1. **Planning Ingestion**: Before generating `spec.md` (Step 2) or `plan.md` (Step 3), run `mcp_exa_get_code_context_exa` to fetch best practices and `list_dir` to understand the current architecture.
2. **Task Ingestion**: During Step 7 (Context Packing), perform a targeted audit of relevant files.
3. **Subagent Invocation**: Use subagents (e.g., `browser_subagent` for UI beads or mental sub-loops for logic) to perform independent reviews.

---

## The 15-Step Lifecycle

### Phase 1: Planning & Definition
0. **START: Problem / Idea**: Define a 1-3 sentence problem statement.
1. **Discovery**: ALWAYS initiate a discovery questionnaire. 
   - **Action**: Intelligently analyze the user's prompt and ask for specific documentation or clarifications (e.g., Requirements, Architecture, Data Model, Test Strategy, Business Logic, Data Schemas, Architecture diagrams) that are missing but required for **extremely clear** requirements.
   - **Goal**: Do not blindly accept a vague prompt. Your job is to ensure the user has provided enough context to minimize hallucinations and rework. 
2. **spec.md (The Source of Truth)**:
   - **User-Authored Requirement**: The `spec.md` must be provided by the user. Do not draft `spec.md` unless the user explicitly requests a draft and then reviews/approves it in writing.
   - **Feedback Agency**: Your role is to **critique** the user's `spec.md`. Identify missing requirements, technical contradictions, or unaddressed edge cases.
   - **Assisted Drafting (Explicit Opt-In Only)**: If the user explicitly asks for a draft, treat it as an unverified proposal until the user provides deep edits or approval.
   - **Continuous Verification**: Run `gitingest` to verify that the `spec.md` aligns with the actual repository state.
3. **Beads Initialization**: Use the codebase context to generate a **Beads-compliant plan** in `.agent/workflows/vibe-plan.md`.
   - Each "Bead" must have: `ID`, `Task Name`, `Status` (Open/Success/Blocked), `Dependencies`, and `Done Criteria`.
4. **Critique**: Spawn a **Subagent** to critique the bead sequence for gaps or risks.
   - **Action**: Critique `plan.md` for gaps, sequencing issues, missing tests, and risk areas.
   - **Output**: Updated `plan.md` plus an explicit test/verification checklist per step.
5. **Rules**: Ensure `rules.md` or `.clauderc` exists with coding conventions.
   - **Gate**: Do not proceed to bead execution until a project-level rules file exists or the user explicitly confirms which existing rules file applies.
   - **Required Content**: conventions, forbidden patterns, how to run tests, and an "ask-if-unclear" clause.

### Mandatory Planning Checklist (Before Step 6)
You MUST confirm all items before selecting a bead:
1) `spec.md` is user-authored and explicitly approved.
2) `plan.md` exists and has been critiqued/refined.
3) Step 5 rules file exists and is confirmed.
4) Beads are generated from `plan.md`.
If any item is missing, stop and request it.

### Phase 2: Execution Loop (Step N)
6. **Select Bead**: Run `bd ready`. Pick the highest priority task.
   - Run `bd update <id> --status in_progress`.
7. **Context Packing Agent**: Enter a sub-agent mode.
    - **Action**: Use `mcp_exa_get_code_context_exa` to gather external patterns (e.g., "financial dashboard best practices").
    - **Action**: Perform a "Mental Sub-Audit" by listing all files and state (from previous beads) being carried over.
    - **Output**: You MUST generate or update a `context-pack.md` for the bead.
    - **Gate**: Do not implement a bead until its `context-pack.md` exists and lists files, invariants, non-goals, and relevant tooling.
7.1 **Test Case Drafting (Required)**:
    - **Action**: Immediately after context packaging, draft explicit test cases for the bead.
    - **Output**: Add a `tests` section to the bead's `context-pack.md` with concrete checks (commands, endpoints, or manual steps).
    - **Gate**: Do not implement until test cases are documented in `context-pack.md`.
8. **Implement**: Generate code changes for the selected bead only.
   - **Gate**: Do not implement unless the prompt explicitly includes `spec.md`, `plan.md`, the applicable `rules.md`, and the bead’s `context-pack.md`.
9. **Verify (The Technical Gate)**: Run tests and checks. Iterate with **Step 11 (Debug Loop)** until green.
   - **Constraint**: You MUST explain the verification logic to the user. Do not just say "tests passed". Explain *what* was tested and *why* it proves correctness.
   - **Gate**: Do not close a bead or claim green unless tests/checks are run (or explicitly documented as N/A with justification).
10. **GREEN Check**: Proceed to Step 12 ONLY if all tests and linters pass.
11. **Debug Loop**: If not green, use logs/traces to fix. Return to Step 9.


### Phase 3: Accountability & Persistence
12. **Human Review (The Accountability Gate)**: 
    - **Action**: Present the diff and explain the logic in business/technical terms.
    - **HITL Requirement**: You MUST ask the user to verify the logic and (ideally) run the verification script themselves. 
    - **Detailed Code Breakdown**: You MUST provide a step-by-step breakdown of the code changes, explaining *what* each major block does and *why* it was written that way.
    - **Comprehension Check**: You MUST ask the user if they understand the implementation. If they have questions, you must answer them before proceeding.
    - **Gate**: DO NOT proceed to Step 14 until the user explicitly states they understand the code and approve the verification results.
    - **Explicit Approval Prompt**: Ask for explicit approval to close the bead only after the user acknowledges the verification output and the diff.
13. **Second Review**: (Optional) Use a different model to audit the changes for security or performance.
14. **Completion & Commit**: 
    - **Action**: Run `bd close <id>` ONLY AFTER human approval.
    - **Action**: Perform an atomic git commit with a clear message.
15. **Loop**: If tasks remain, return to Step 6.

---

## Interoperability Instructions
This skill is designed to be portable. When used in Claude Code, it leverages standard tools like `bash` and `read_file`. In agents like Cline or RooCode, it maps to the equivalent filesystem and command-line tools.
