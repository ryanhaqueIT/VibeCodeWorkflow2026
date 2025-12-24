# Spec (Draft for Review)

Status: Draft (user review required)

## Problem Statement
Create a Maestro-style web UI inside this repo that orchestrates multiple parallel Codex CLI sessions, each bound to a bead/task, while also producing a structural replica of the Wanderlog trip plan UI using the existing UI/UX documentation.

## Goals / Success Criteria
1) A Maestro-style web UI runs from `tools/maestro` and can launch multiple Codex CLI sessions in parallel.
2) Each Codex session is bound to a bead/task and reports status back to the UI.
3) Beads are sourced from the existing beads system (`bd`) and can be assigned/executed from the UI.
4) A structural replica app for the Wanderlog trip plan layout exists in this repo, aligned to the documented UI/UX inventory and screenshots.
5) Planning artifacts (`spec.md`, `plan.md`, bead plan, research notes) live under `wonderlad-demo/`.
6) The parallel runner supports fan-out/fan-in execution with clear aggregation of results (per bead status + logs).

## Non-Goals
- Pixel-perfect reproduction of Wanderlog.
- Any backend data services for the replica (static UI only).
- Non-Codex agent providers beyond Codex CLI (future).

## Constraints
- Use existing repo and place Maestro-based UI in `tools/maestro`.
- Use the existing beads tracking (`bd`) as the system of record.
- The replica should be a structural UI clone, not a functional app.
- Avoid destructive git operations.
- Windows-first local development and execution.
- Keep secrets out of logs and checked-in files.


## Requirements

### Maestro-Style Orchestrator UI
Functional Requirements:
- Display bead/task list with status and metadata (ID, title, status).
- Allow assigning beads to Codex sessions.
- Launch multiple Codex CLI processes in parallel from the UI.
- Show per-session status: running, success, failed, blocked.
- Provide logs/outputs per session (at minimum, tail output).
- Allow stop/cancel for a running session.
- Provide a queue or limit on max parallel sessions.
- Surface exit codes and last error per session.
- Support a session “refresh” to resync from running processes after UI reload.
- Show bead-to-session mapping and current phase (queued, running, finished).
- Provide per-session working directory visibility (repo root or worktree).

Non-Functional Requirements:
- Keyboard-first UI patterns similar to Maestro.
- Fast, responsive list updates (no long UI blocking).
- Works on Windows (local development).
- Avoid UI operations that require elevated permissions.
- UI must remain responsive with 10+ concurrent sessions.

### Beads Integration
- Read tasks via `bd` CLI (preferred) or a documented direct read path.
- Use `bd update <id> --status in_progress` and `bd close <id>` when tasks are complete.
- Keep any status sync logic explicit and traceable.
- Define status mapping between beads and session states (ready, in_progress, blocked, success).
- Capture provenance: record which session/command updated bead status.
- Ensure no duplicate tracking systems (bd is source of truth).

### Wanderlog Trip Plan Replica
- Use the existing UI/UX inventory and screenshot set in `docs/wanderlog-trip-plan/`.
- Build a layout skeleton that matches major sections and navigation.
- Use placeholder data where needed.
- No additional documentation deliverables beyond existing inventory unless explicitly requested.

## Architecture

### High-Level
- `tools/maestro`: forked/copied Maestro UI, adapted to integrate with beads + Codex CLI.
- `wonderlad-demo/apps/wanderlog-clone` (or similar): new frontend for the trip plan replica.
- A local "runner" layer that the UI calls to spawn Codex CLI processes and track their output.
- A local API/IPC boundary between UI and runner (HTTP or IPC).
- Web-first UI: run as a web app (no Electron requirement), while borrowing Maestro UI components/themes.

### Architecture Diagram
```mermaid
flowchart LR
  subgraph UI["Maestro-Style Web UI (tools/maestro)"]
    UIA[Bead List + Queue]
    UIS[Session Viewer + Logs]
    UIC[Controls: Run / Cancel / Retry]
  end

  subgraph Runner["Local Runner Service"]
    Q[Queue + Concurrency Control]
    PR[Process Runner (codex CLI)]
    LOG[Log Store]
    REG[Session Registry]
  end

  subgraph Beads["Beads (bd CLI)"]
    BD[bd ready/list/update/close]
    JSONL[.beads/issues.jsonl]
  end

  subgraph Clone["Wanderlog Clone App"]
    WC[UI Replica (wonderlad-demo/apps/wanderlog-clone)]
  end

  UIA --> Runner
  UIS --> Runner
  UIC --> Runner

  Runner --> PR
  Runner --> LOG
  Runner --> REG
  Runner <--> BD
  BD --> JSONL

  UIA --> BD
  WC -. referenced by .-> UIA
```

### Proposed Components
- Maestro UI shell (copied from upstream).
- Beads adapter: list/claim/close beads using `bd`.
- Codex runner: spawn `codex` CLI per bead; track PID, stdout/stderr.
- Session registry: in-memory or lightweight local store for running session state.
- Log store: per-session log files under `wonderlad-demo/logs/` (or similar).
- Runner service: handles queueing, concurrency, and lifecycle events for Codex sessions.
- IPC transport: local HTTP (preferred) or direct IPC bridge for UI->runner calls.

## Data Model (Draft)
- Bead:
  - `id: string`
  - `title: string`
  - `status: "open" | "in_progress" | "success" | "blocked" | "failed"`
  - `priority: number`
  - `description?: string`
  - `deps?: string[]`
- Session:
  - `id: string`
  - `beadId: string`
  - `status: "queued" | "running" | "success" | "blocked" | "failed" | "cancelled"`
  - `startedAt?: string`
  - `endedAt?: string`
  - `pid?: number`
  - `logPath: string`
  - `exitCode?: number`
  - `lastError?: string`
  - `workdir: string`
- RunnerConfig:
  - `maxParallel: number`
  - `workdirMode: "repo" | "worktree"`
  - `logRetentionDays: number`
- Event (optional, UI updates):
  - `type: "session_started" | "session_output" | "session_exit" | "bead_status_changed"`
  - `sessionId: string`
  - `beadId?: string`
  - `timestamp: string`
  - `payload: object`

## Workflow
1) UI loads beads list.
2) User selects beads and starts parallel run.
3) For each bead: mark in_progress, spawn Codex CLI, stream logs.
4) On completion: mark success/blocked; allow retry or close.
5) On cancel/kill: mark blocked with reason and retain logs.
6) On UI restart: rehydrate sessions from log/pid registry and reconcile bead status.

## Open Questions / Risks
- License implications of copying Maestro (AGPL-3.0).
- Best IPC mechanism between UI and runner (local HTTP, node child_process).
- Where to persist session logs and metadata.
- Decide whether to use git worktrees per bead for isolation.
- Define default max parallel sessions and resource limits.
- Define failure handling policy (retry, backoff, user prompt) for beads.
- Decide if Codex runs in same repo or per-worktree directory.
- Clarify distribution intent (internal use only vs external) to satisfy AGPL obligations.

## Testing / Verification
- Manual run: start 2+ beads in parallel; confirm status updates.
- Verify `bd` status transitions with CLI output.
- UI smoke test for replica layout on desktop and mobile breakpoints.
- Kill a running Codex process and confirm UI reflects failure and bead status updates.
- Restart UI and confirm session rehydration works.

## License Compliance (AGPL)
- Preserve Maestro license and notices in `tools/maestro`.
- Document any modifications and provide source availability if distributed.

## Acceptance Criteria
- Maestro UI can start multiple Codex CLI sessions concurrently and display their status.
- Each session is bound to a bead/task, and statuses update in beads via `bd`.
- Wanderlog structural replica app renders key sections per inventory.
