Directory structure:
└── VibeCodeWorkflow2026/
    ├── README.md
    ├── AGENTS.md
    ├── context-dev/
    │   ├── automation-blueprint.md
    │   ├── beads-plan-template.md
    │   ├── critique.md
    │   ├── How-Skills-Work.md
    │   ├── research-summary.md
    │   ├── skill-templates.ts
    │   ├── spec.md
    │   └── technical-roadmap.md
    ├── scripts/
    │   ├── pack-context.ps1
    │   └── sync-vibe.ps1
    ├── skills/
    │   ├── beads-utility/
    │   │   └── SKILL.md
    │   └── vibecode-lifecycle/
    │       └── SKILL.md
    ├── .agent/
    │   ├── work/
    │   │   └── vibe-state.json
    │   └── workflows/
    │       ├── vibe-lifecycle.md
    │       └── vibe-plan.md
    └── .beads/
        ├── README.md
        ├── config.yaml
        ├── interactions.jsonl
        └── metadata.json

================================================
FILE: README.md
================================================
[Binary file]


================================================
FILE: AGENTS.md
================================================
# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds




================================================
FILE: context-dev/automation-blueprint.md
================================================
# Automation Blueprint: Compliant VibeCode Skill

This document maps the **VibeCode Lifecycle** to the standardized `SKILL.md` format, ensuring deep automation and interoperability across all major AI agent platforms.

## Core Specification: `SKILL.md`

The authoritative skill definition resides in [context-dev/SKILL.md](file:///c:/Users/ryanh/VibeCodeWorkflow2026/context-dev/SKILL.md). It uses the standard metadata table and structured instructions recognized by the Claude Agent SDK and the wider MCP ecosystem.

## Tool Orchestration

### 1. beads (State & Planning)
- **Role**: Workflow controller and memory upgrade.
- **Integration**: The skill mandates checking `.agent/work/vibe-state.json` to prevent workflow drift.
- **Workflow**: `plan.md` is initialized as a bead-compliant workflow in `.agent/workflows/`.

### 2. gitingest (Context Packing)
- **Role**: Automated repo ingestion.
- **Integration**: Explicitly triggered in Step 7 to prepare the ground for the implementation subagent.

## Lifecycle Automation Summary

| Step | Activity | Skill Instruction / Tool Usage |
| :--- | :--- | :--- |
| **0-1** | Discovery | **LLM Reasoning**: Enforces deep discovery. |
| **2** | Write spec.md | **GitIngest**: Studies existing repo before drafting architecture. |
| **3** | Beads Plan | **GitIngest + beads**: Generates a **Beads-compliant** `vibe-plan.md` in `.agent/workflows/`. |
| **4** | Critique | **Subagent**: Spawns a dedicated reviewer to audit the bead sequence. |
| **5** | Rules | **Validation**: Ensures standards are documented. |
| **6** | Select Bead | **beads**: Reads `vibe-plan.md`, checks dependencies, and updates state. |
| **7** | Context Packing | **GitIngest / Context Agent**: Dumps tailored subset of repo for the specific bead. |
| **8-11**| Implement & Fix | **LLM Loop**: Implementation with automated verification gates per bead. |

## Portability Matrix

| Agent | Capability Loading | Interoperability Rank |
| :--- | :--- | :--- |
| **Claude Code** | `.claude/plugins` or system prompt | High |
| **Cline / RooCode** | Custom Rules / Instruction set | High |
| **Agent SDK** | Direct import of `SKILL.md` logic | Maximum |



================================================
FILE: context-dev/beads-plan-template.md
================================================
# Beads Plan: [Project Name]

| ID | Task Name | Status | Dependencies | Definition of Done |
| :--- | :--- | :--- | :--- | :--- |
| B1 | Project Init | Success | - | .agent/workflows/ exists |
| B2 | State Setup | In-Progress| B1 | .agent/work/vibe-state.json initialized |
| B3 | discovery | Open | B2 | Discovery questions answered |

---

## Thread State
- **Current Bead**: B2
- **Goal**: Full VibeCode Automation



================================================
FILE: context-dev/critique.md
================================================
# Critique: Beads-Driven Planning for VibeCode Automation

## Plan Audit (`vibe-plan.md`)
The current plan consists of five beads (B1-B5). 

### Risks Identified
1. **Context Overload**: B3 (Automation Logic 2/7) combines two major integration points. If `gitingest` fails or times out on a massive repo, B3 could be blocked indefinitely.
2. **State Sync Complexity**: B4 (State Transition Logic) might require more than just a simple JSON update if the agent crashes mid-transaction.
3. **Distribution Barrier**: B5 assumes a simple README update is enough. We might need a `setup.sh` or a `VibeCode` CLI wrapper for true "generic agent" support.

### Proposed Mitigations
- **Break up B3**: Separate Step 2 (Initial Spec Ingestion) from Step 7 (Per-Bead Context Packing).
- **Add B6 (Robustness)**: Add a bead for "Transaction Safety" to ensure `vibe-state.json` isn't corrupted.
- **Add B7 (Bundling)**: Add a bead for creating a `.zip` or `npm` package structure for the skill.

## Alignment Check
The plan matches the `spec.md` but focuses heavily on the *happy path*. 

**Critique Outcome**: Pass with minor adjustments. I will now update `vibe-plan.md` to include these more granular steps.



================================================
FILE: context-dev/How-Skills-Work.md
================================================
# How SKILL.md Works: The Technical Breakdown

The `SKILL.md` format is an open standard (published by Anthropic in late 2025) designed to make AI agent capabilities portable, modular, and discoverable.

## 1. The Discovery Mechanism
When an agent (like Claude Code or a compatible MCP client) starts, it performs a **Recursive Scan** of specific directories:
- **Local Project**: `.claude/skills/` or a dedicated `skills/` folder.
- **Global Config**: User-level skill directories.

The agent parses every `.md` file looking for the **Metadata Table**:
```markdown
| | |
| --- | --- |
| name | skill-name |
| description | When to use this skill... |
```
This description is the most important part because it's what the agent uses for **Semantic Mapping**.

## 2. Intent Matching
Agents don't "run" a skill like a binary. Instead, they use the skill's description to decide when to "invoke" it. 
- **Example**: If you say "Start a new feature using the VibeCode lifecycle," the agent matches your request to the description in `SKILL.md` and triggers the **Skill Tool**.

## 3. Prompt Expansion (The "Boot" Sequence)
Once invoked, the skill undergoes **Prompt Expansion**:
1. The agent reads the `instructions` section of the `SKILL.md`.
2. This text is injected into the **System Prompt** for that specific turn or sub-session.
3. The agent's "Logic" is essentially "upgraded" to follow the new rules defined in the skill.

## 4. How to use in Antigravity (Right Now)

Antigravity uses a very similar system called **Workflows** (`.agent/workflows`). To activate the VibeCode skill in Antigravity today, you have two paths:

### Path A: The Workflow Engine (Recommended)
Antigravity explicitly recognizes files in `.agent/workflows/`. 
1. Move the `SKILL.md` content into `.agent/workflows/vibecode.md`.
2. I (Antigravity) will then be able to reference it as an executable workflow.

### Path B: System Instruction Injection
1. You can copy the content of `SKILL.md` into your agent's **Custom Instructions** (or "Rules" file).
2. This ensures the 15-step "Workflow Controller" is always active in my background reasoning.

---
**Verdict**: The `SKILL.md` you just created is technically "ready to go," but to make it *automatically* active, you should link it to the `.agent/workflows` directory which is my primary native discovery path.



================================================
FILE: context-dev/research-summary.md
================================================
# Research Summary: Claude Code Skills & Plugins

## Overview

"Claude Code Skills" and "Plugins" represent the new extensible architecture for Anthropic's **Claude Code CLI**. This system allows developers to package domain-specific knowledge, custom tools, and automated workflows into modular, shareable units.

## Key Findings

### 1. Open Source Evolution
The "open source capability" the user referred to is the community-driven ecosystem emerging at sites like **[claude-plugins.dev](https://claude-plugins.dev)** and GitHub repositories like **[awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)**. 
- Skills are no longer just "hidden prompt instructions"; they are now authored as **TypeScript/JavaScript** modules.
- The **Agent SDK** (`@anthropic-ai/claude-agent-sdk`) allows for creating modular tools and sub-agents that can be bundled into these plugins.

### 2. Technical Capabilities
- **Full Network Access**: Unlike the Claude.ai web interface, skills running in Claude Code have full network and filesystem access.
- **Dynamic Context Injection**: Skills can be invoked by Claude based on textual matching of the user's intent to the skill's description.
- **Subagents**: Claude Code can spin up "narrow" agents (e.g., a "Security Reviewer" or a "Test Fixer") to handle specific steps of a larger process.

### 3. Plugin Components
A robust Claude Code plugin (like the one we propose for VibeCode) consists of:
- **Skills**: High-level instruction sets + logic.
- **Tools**: Specialized functions (e.g., `grep`, `write`, or custom `pack-context`).
- **Slash Commands**: Explicit entry points for the user (e.g., `/vibe`).
- **Hooks**: Automated triggers for events like `pre-commit`, `post-execution`, or `on-error`.

## Relevance to VibeCode Lifecycle

The 15-step VibeCode Lifecycle is a perfect candidate for a Claude Code Plugin. Currently, this workflow relies on "Human Middleware" to ensure steps aren't skipped. A plugin can:
- **Enforce the State Machine**: Track which step the user is on (e.g., in a `.vibe-state.json`).
- **Automate Artifact Generation**: Automatically trigger Step 2 (Spec) after Step 1 (Discovery) is finished.
- **Context Packing**: Use a dedicated skill to automate Step 7 (`context-packing`) based on the current task card.

---
*Research conducted via Exa MCP on 2025-12-22.*



================================================
FILE: context-dev/skill-templates.ts
================================================
/**
 * VibeCode Lifecycle Automation - Skill Boilerplate
 * 
 * Based on the Claude Code Agent SDK and Plugin Architecture.
 */

// Example of a Discovery Skill definition
export const discoverySkill = {
    name: "vibecode-discovery",
    description: "Guides the user through Step 1: Requirements Discovery using a question-loop pattern.",
    instructions: `
    1. Ask the user clarifying questions about their idea.
    2. Focus on: Success Criteria, Non-goals, Constraints, Risks, and Edge cases.
    3. Do not stop until you have a comprehensive requirements list.
    4. Once finished, suggest moving to Step 2: Spec Generation.
  `,
    capabilities: ["subagent", "filesystem"],
};

// Example of a Context Packing Tool
export const contextPacker = {
    name: "pack_vibe_context",
    description: "Automates Step 7 by bundling relevant repo context for a specific task.",
    parameters: {
        type: "object",
        properties: {
            taskDescription: { type: "string", description: "The current task from plan.md" },
            focusFiles: { type: "array", items: { type: "string" }, description: "Files to deeply analyze" }
        },
        required: ["taskDescription"]
    },
    execute: async ({ taskDescription, focusFiles }, { bash }) => {
        // Logic to run gitingest or direct file reads
        const context = await bash(`gitingest . --include "${focusFiles?.join(',') || '*'}"`);
        return {
            content: [
                { type: "text", text: "Context packed successfully." },
                { type: "file", path: "context-pack.md", content: context }
            ]
        };
    }
};

// Example of a Workflow Hook
export const postExecutionHook = {
    on: "post-tool-call",
    filter: (call) => call.tool === "write_file" || call.tool === "bash",
    execute: async (context, { ask }) => {
        const isGreen = await ask("Did the tests pass? (Checking Step 10)");
        if (!isGreen) {
            return {
                action: "suggest",
                message: "Step 10 check failed. Should we enter Step 11: Debug Mode?"
            };
        }
    }
};



================================================
FILE: context-dev/spec.md
================================================
# Spec: VibeCode Lifecycle Automation Skill

## Goal
Automate the 15-step VibeCode Lifecycle into a portable, high-context AI Skill that ensures disciplined development across different agent environments.

## Requirements

### R1: Portability
- The skill must be defined in a standard-compliant `SKILL.md` file.
- It must also support the Antigravity-native `.agent/workflows/` format.

### R2: Disciplined Planning
- **Step 1 (Discovery)**: Must be mandatory. The agent always generates a questionnaire to clarify the "Definition of Done".
- **Step 2 (Ingestion)**: Must perform a full-repo scrape via `gitingest` to build an "overall map" of the project.

### R3: State Management (Beads)
- The workflow state must be persisted in `.agent/work/vibe-state.json`.
- Task planning (Step 3) must use the **Beads Pattern**: structured tasks with IDs and dependencies in `.agent/workflows/vibe-plan.md`.

### R4: Context Packing
- Step 7 must use `gitingest` to provide a "full view" of the repository to the implementation agent.

## Architecture

### Components
1. **The Skill Controller (`SKILL.md`)**: The core prompt instructions that enforce the 15 steps.
2. **The Workflow Driver (`vibe-lifecycle.md`)**: The Antigravity-specific execution script.
3. **State Tracker (`vibe-state.json`)**: Persistent JSON for current step and history.
4. **Beads Engine (`vibe-plan.md`)**: The task queue with status and dependency tracking.

### Tool Integration
- **Context**: `gitingest` (CLI or MCP).
- **Communication**: Subagents (for critique and second reviews).
- **Persistence**: Filesystem (for beads and state).

## Test Strategy
1. **Workflow Traverse**: Verify that the agent proceeds from Step 0 to 15 without skipping steps.
2. **State Persistence**: Verify that restarting the agent allows it to resume from the last completed step in `vibe-state.json`.
3. **Beads Logic**: Verify that Step 6 correctly identifies the next task based on dependency completion in `vibe-plan.md`.



================================================
FILE: context-dev/technical-roadmap.md
================================================
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
â”œâ”€â”€ SKILL.md          # The master controller (I have drafted this for you)
â”œâ”€â”€ beads_schema.json # Defines the structure for the beads.md
â”œâ”€â”€ scripts/          # Helper scripts for git-ingest or test running
â””â”€â”€ package.json      # Metadata and dependency listing (if MCP)
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



================================================
FILE: scripts/pack-context.ps1
================================================
# Runs gitingest and captures the output for the agent
$OutputPath = "context-pack.md"

# Try to find a working gitingest call
if (Get-Command gitingest -ErrorAction SilentlyContinue) {
    gitingest . --output $OutputPath
} else {
    python -m gitingest . --output $OutputPath
}

if (Test-Path $OutputPath) {
    Write-Host "Context packed successfully to $OutputPath" -ForegroundColor Green
} else {
    Write-Error "Failed to generate context-pack.md"
}



================================================
FILE: scripts/sync-vibe.ps1
================================================
param (
    [Parameter(Mandatory=$true)]
    [string]$BeadId,
    [string]$Message = "Task completed."
)

# 1. Close the bead in official Beads CLI
Write-Host "Closing bead $BeadId..." -ForegroundColor Cyan
& $HOME\go\bin\bd.exe close $BeadId

# 2. Update the vibe-state.json
$StatePath = Join-Path $PSScriptRoot "..\.agent\work\vibe-state.json"
if (Test-Path $StatePath) {
    $State = Get-Content $StatePath | ConvertFrom-Json
    $State.history += "Completed Bead ${BeadId}: ${Message}"
    $State.current_bead_id = "" # Clear current focusing
    $State | ConvertTo-Json -Depth 10 | Set-Content $StatePath
    Write-Host "State updated in vibe-state.json" -ForegroundColor Green
} else {
    Write-Warning "vibe-state.json not found at $StatePath"
}



================================================
FILE: skills/beads-utility/SKILL.md
================================================
| | |
| --- | --- |
| name | beads-utility |
| description | A utility skill that teaches agents how to interact with the Beads memory system for stateful coding. |
| license | MIT |
| category | development-tools |

# Beads Utility Skill

You are an agent trained to use **Steve Yegge's Beads** memory system. Beads allows you to maintain state across different chat sessions and even different agents by storing task information in the filesystem.

## Core Concepts

### 1. The Bead Plan (`.agent/workflows/vibe-plan.md`)
The "Plan" is a markdown table of "Beads" (tasks). 
- Every bead has an `ID` (e.g., B1, B2).
- Every bead has a `Status`: `Open`, `In-Progress`, `Success`, `Blocked`, or `Failed`.
- Every bead lists its `Dependencies` by ID.

### 2. The Thread State (`.agent/work/vibe-state.json`)
The machine-readable current state.
- Stores the `current_bead_id`.
- Stores metadata like `problem_statement`.

## Agent Instructions

### Task Selection (Step 6)
When starting work, you MUST:
1. Read `.agent/workflows/vibe-plan.md`.
2. Find the earliest "Open" bead where all dependencies are "Success".
3. Update that bead's status to "In-Progress".
4. Declare your current goal: "I am now working on Bead [ID]: [Name]".

### Context Packing (Step 7)
Before implementing a bead:
1. Run `gitingest` to get repo context.
2. Specifically look for files mentioned in the bead's "Definition of Done".

### Completion (Step 9/10)
When a task is verified:
1. Update the bead status to "Success" in `.agent/workflows/vibe-plan.md`.
2. Sync the JSON in `.agent/work/vibe-state.json`.

---

## Setting up Beads
To initialize Beads in a new project:
1. Create `.agent/workflows/` and `.agent/work/`.
2. Initialize `vibe-plan.md` with the task table.
3. Initialize `vibe-state.json` with step 0 metadata.



================================================
FILE: skills/vibecode-lifecycle/SKILL.md
================================================
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
Use the official **`bd`** CLI tool to track progress.
- Initialize with `bd init`.
- Use `bd ready` to discover available tasks.
- Use `bd update <id> --status in_progress` when starting a bead.
- Use `bd close <id>` when the bead is green.


### Context Ingestion (`gitingest`)
To prevent hallucinations and drift, you MUST maintain a high-context environment:
1. **Planning Ingestion**: Before generating `spec.md` (Step 2) or `plan.md` (Step 3) in an existing repository, run `gitingest` to understand the current architecture.
2. **Task Ingestion**: During Step 7 (Context Packing), run `gitingest` focused on the specific files and interfaces relevant to the current task bead.
- Store results in `context-pack.md` or as a block in your context.

---

## The 15-Step Lifecycle

### Phase 1: Planning & Definition
0. **START: Problem / Idea**: Define a 1-3 sentence problem statement.
1. **Discovery**: ALWAYS initiate a discovery questionnaire. Even if the problem statement seems clear, explore edge cases, constraints, and "definition of done" to ensure total alignment.
2. **spec.md**: Run `gitingest` to perform a full-repo scrape. Provide an overall overview of what exists and a mapping of all critical files before consolidating into `spec.md`.
3. **Beads Initialization**: Use the codebase context to generate a **Beads-compliant plan** in `.agent/workflows/vibe-plan.md`.
   - Each "Bead" must have: `ID`, `Task Name`, `Status` (Open/Success/Blocked), `Dependencies`, and `Done Criteria`.
4. **Critique**: Spawn a **Subagent** to critique the bead sequence for gaps or risks.
5. **Rules**: Ensure `rules.md` or `.clauderc` exists with coding conventions.

### Phase 2: Execution Loop (Step N)
6. **Select Bead**: Run `bd ready`. Pick the highest priority task.
   - Run `bd update <id> --status in_progress`.
7. **Context Packing Agent**: Enter a sub-agent mode (or use yourself) to "pack context".
   - ALWAYS perform a comprehensive repo scrape via `gitingest` to maintain an "overall" view of the system.
   - Summarize the file tree and critical interfaces.
8. **Implement**: Generate code changes for the selected bead only.
9. **Verify**: Run tests and checks. 
10. **State Management**: Run `bd close <id>` once the bead is verified.


### Phase 3: Quality & Persistence
12. **Human Review**: Present the diff and explain the logic for human approval.
13. **Second Review**: (Optional) Use a different model to audit the changes.
14. **Commit**: perform a small, atomic git commit with a clear message.
15. **Loop**: If tasks remain in `plan.md`, return to Step 6. Otherwise, initiate PR/merge.

---

## Interoperability Instructions
This skill is designed to be portable. When used in Claude Code, it leverages standard tools like `bash` and `read_file`. In agents like Cline or RooCode, it maps to the equivalent filesystem and command-line tools.



================================================
FILE: .agent/work/vibe-state.json
================================================
{
    "current_step":  8,
    "status":  "implementation:B4",
    "problem_statement":  "Automate the 15-step VibeCode Lifecycle as a portable, distributable Skill with integrated Beads and GitIngest support.",
    "history":  [
                    "Step 0: Problem defined.",
                    "Step 1: Discovery completed.",
                    "Step 2: spec.md created.",
                    "Step 3: Beads Plan generated and skills reorganized into /skills/ folders.",
                    "Step 4: Critique performed and Beads Plan refined.",
                    "Completed Bead VibeCodeWorkflow2026-8de: Implemented state sync script."
                ]
}



================================================
FILE: .agent/workflows/vibe-lifecycle.md
================================================
---
description: VibeCode Lifecycle Workflow - A 15-step automated process for deep context-aware coding.
---

# VibeCode Lifecycle Workflow

This workflow automates the 15-step VibeCode Lifecycle. It integrates Steve Yegge's `beads` for state management and `gitingest` for high-context ingestion.

## Core Setup
1. **Beads (`beads`)**: Use for workflow tracking in `.agent/workflows`. State is stored in `.agent/work/vibe-state.json`.
2. **GitIngest**: Use for repo-wide context gathering during Planning and Execution.

---

## 1. Planning & Definition Phase

### Step 0: Problem Statement
- Define the core problem in 1-3 sentences.
- Ensure boundaries are clear before proceeding.

### Step 1: Discovery
- ALWAYS generate a mandatory questionnaire to clarify requirements and edge cases.
- Output: Requirements list + edge cases.


### Step 2: spec.md
// turbo
- Run `gitingest` to study the repository.
- Consolidate requirements, architecture, and test strategy into `spec.md`.

### Step 3: Beads Plan (`bd create`)
- Use the codebase context to generate a structured plan.
- **Action**: For each task, run `bd create "[ID]: [Title]" -p 0`.
- **Action**: Link dependencies with `bd dep add <child> <parent>`.

### Step 4: Critique
- Spawn a subagent to critique the bead sequence for risks and gaps.

### Step 5: Rules & Guardrails
- Ensure `rules.md` (or equivalent) exists with project conventions.

---

## 2. Execution Phase (Step N)

### Step 6: Select Bead
- Run `bd ready` and select the next available task.
- **Action**: Run `bd update <id> --status in_progress`.

### Step 7: Context Packing
// turbo
- ALWAYS perform a full repo scrape via `gitingest` to provide an overall view.
- List all files and their roles.

### Step 8: Implementation
- Implement changes for the selected bead only.

### Step 9: Verification
- Run tests and checks. Iterate until the bead's DOD is met.

### Step 10: Bead Completion
- **Action**: Run `bd close <id>`.
- Update state in `.agent/work/vibe-state.json`.

---

## 3. Review & Deployment Phase

### Step 12: Human Review
- Present diffs and explain logic for human accountability.

### Step 13: Second Model Review
- (Optional) Spawn a second subagent with a different model to audit the changes.

### Step 14: Atomic Commit
- Perform an atomic git commit with a structured message.

### Step 15: Loop or Merge
- If tasks remain, return to Step 6. Otherwise, initiate PR/merge.



================================================
FILE: .agent/workflows/vibe-plan.md
================================================
# Beads Plan: VibeCode Lifecycle Automation

This plan tracks the implementation of the automated VibeCode Skill.

| ID | Task Name | Status | Dependencies | Definition of Done |
| :--- | :--- | :--- | :--- | :--- |
| eia | B1: Infrastructure Setup | Success | - | .agent/work and state.json initialized. |
| jqp | B2: Utility Skills | Success | B1 | BEADS_UTILITY_SKILL.md created. |
| bw1 | B3: Meta-Skill Step 2 | Success | B2 | SKILL.md updated with full-scrape logic. |
| 8de | B4: State Sync Logic | Ready | B3 | vibe-lifecycle.md handles status updates. |
| 8m7 | B5: Context Packing Step 7| Blocked | B4 | SKILL.md handles per-task context. |
| oiu | B6: Robustness/Recovery | Blocked | B5 | Lockfile or backup for vibe-state.json. |
| 2qb | B7: Distribution Bundle | Blocked | B6 | Skill folders zipped and README updated. |

---

## Thread State
- **Problem**: Automate the VibeCode Lifecycle as a portable Skill.
- **Current Bead**: 8de (B4)
- **Official Engine**: bd CLI (installed via Go)



================================================
FILE: .beads/README.md
================================================
# Beads - AI-Native Issue Tracking

Welcome to Beads! This repository uses **Beads** for issue tracking - a modern, AI-native tool designed to live directly in your codebase alongside your code.

## What is Beads?

Beads is issue tracking that lives in your repo, making it perfect for AI coding agents and developers who want their issues close to their code. No web UI required - everything works through the CLI and integrates seamlessly with git.

**Learn more:** [github.com/steveyegge/beads](https://github.com/steveyegge/beads)

## Quick Start

### Essential Commands

```bash
# Create new issues
bd create "Add user authentication"

# View all issues
bd list

# View issue details
bd show <issue-id>

# Update issue status
bd update <issue-id> --status in_progress
bd update <issue-id> --status done

# Sync with git remote
bd sync
```

### Working with Issues

Issues in Beads are:
- **Git-native**: Stored in `.beads/issues.jsonl` and synced like code
- **AI-friendly**: CLI-first design works perfectly with AI coding agents
- **Branch-aware**: Issues can follow your branch workflow
- **Always in sync**: Auto-syncs with your commits

## Why Beads?

âœ¨ **AI-Native Design**
- Built specifically for AI-assisted development workflows
- CLI-first interface works seamlessly with AI coding agents
- No context switching to web UIs

ðŸš€ **Developer Focused**
- Issues live in your repo, right next to your code
- Works offline, syncs when you push
- Fast, lightweight, and stays out of your way

ðŸ”§ **Git Integration**
- Automatic sync with git commits
- Branch-aware issue tracking
- Intelligent JSONL merge resolution

## Get Started with Beads

Try Beads in your own projects:

```bash
# Install Beads
curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Initialize in your repo
bd init

# Create your first issue
bd create "Try out Beads"
```

## Learn More

- **Documentation**: [github.com/steveyegge/beads/docs](https://github.com/steveyegge/beads/tree/main/docs)
- **Quick Start Guide**: Run `bd quickstart`
- **Examples**: [github.com/steveyegge/beads/examples](https://github.com/steveyegge/beads/tree/main/examples)

---

*Beads: Issue tracking that moves at the speed of thought* âš¡



================================================
FILE: .beads/config.yaml
================================================
# Beads Configuration File
# This file configures default behavior for all bd commands in this repository
# All settings can also be set via environment variables (BD_* prefix)
# or overridden with command-line flags

# Issue prefix for this repository (used by bd init)
# If not set, bd init will auto-detect from directory name
# Example: issue-prefix: "myproject" creates issues like "myproject-1", "myproject-2", etc.
# issue-prefix: ""

# Use no-db mode: load from JSONL, no SQLite, write back after each command
# When true, bd will use .beads/issues.jsonl as the source of truth
# instead of SQLite database
# no-db: false

# Disable daemon for RPC communication (forces direct database access)
# no-daemon: false

# Disable auto-flush of database to JSONL after mutations
# no-auto-flush: false

# Disable auto-import from JSONL when it's newer than database
# no-auto-import: false

# Enable JSON output by default
# json: false

# Default actor for audit trails (overridden by BD_ACTOR or --actor)
# actor: ""

# Path to database (overridden by BEADS_DB or --db)
# db: ""

# Auto-start daemon if not running (can also use BEADS_AUTO_START_DAEMON)
# auto-start-daemon: true

# Debounce interval for auto-flush (can also use BEADS_FLUSH_DEBOUNCE)
# flush-debounce: "5s"

# Git branch for beads commits (bd sync will commit to this branch)
# IMPORTANT: Set this for team projects so all clones use the same sync branch.
# This setting persists across clones (unlike database config which is gitignored).
# Can also use BEADS_SYNC_BRANCH env var for local override.
# If not set, bd sync will require you to run 'bd config set sync.branch <branch>'.
# sync-branch: "beads-sync"

# Multi-repo configuration (experimental - bd-307)
# Allows hydrating from multiple repositories and routing writes to the correct JSONL
# repos:
#   primary: "."  # Primary repo (where this database lives)
#   additional:   # Additional repos to hydrate from (read-only)
#     - ~/beads-planning  # Personal planning repo
#     - ~/work-planning   # Work planning repo

# Integration settings (access with 'bd config get/set')
# These are stored in the database, not in this file:
# - jira.url
# - jira.project
# - linear.url
# - linear.api-key
# - github.org
# - github.repo



================================================
FILE: .beads/interactions.jsonl
================================================
[Empty file]


================================================
FILE: .beads/metadata.json
================================================
{
  "database": "beads.db",
  "jsonl_export": "issues.jsonl"
}

