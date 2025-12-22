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

| Phase | Step | Activity | Skill Instruction / Tool Usage |
| :--- | :--- | :--- |
| **0-1** | Discovery | **LLM Reasoning**: Enforces deep discovery. |
| **2** | Write spec.md | **GitIngest**: Studiess existing repo before drafting architecture. |
| **3** | Generate Plan | **GitIngest + beads**: Uses full context to create `plan.md` in `.agent/workflows/`. |
| **4** | Critique | **Subagent**: Spawns a dedicated reviewer. |
| **5** | Rules | **Validation**: Ensures standards are documented. |
| **6** | Select Task | **beads**: Picks the next "bead" (task) and updates state. |
| **7** | Context Packing | **GitIngest / Context Agent**: Dumps tailored subset of repo for the task. |
| **8-11**| Implement & Fix | **LLM Loop**: Implementation with automated verification gates. |

## Portability Matrix

| Agent | Capability Loading | Interoperability Rank |
| :--- | :--- | :--- |
| **Claude Code** | `.claude/plugins` or system prompt | High |
| **Cline / RooCode** | Custom Rules / Instruction set | High |
| **Agent SDK** | Direct import of `SKILL.md` logic | Maximum |
