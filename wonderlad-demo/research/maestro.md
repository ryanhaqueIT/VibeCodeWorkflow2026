# Maestro Research Notes

Source: `tools/maestro` (cloned from https://github.com/pedramamini/Maestro)

## Architecture Summary
- Electron dual-process architecture:
  - Main process (`src/main/`): system access, process spawning, IPC handlers.
  - Renderer (`src/renderer/`): React UI with no Node access; talks to main via preload bridge.
- `ProcessManager` manages:
  - PTY terminal sessions (`node-pty`).
  - Child processes for AI agents (`child_process.spawn`).
  - Emits data/exit/usage events.
- IPC bridge exposes `window.maestro` API:
  - `process.spawn/write/interrupt/kill/resize` for session control.
  - `git` helpers, `fs`, `settings`, `sessions`, etc.
- Renderer services wrap IPC calls (`src/renderer/services/*`).

## UI/UX Patterns Worth Reusing
- Three-panel layout with keyboard-first interactions.
- Layer stack system for modals/overlays (`useLayerStack`).
- Theme system (`src/renderer/constants/themes.ts`) with shared theme types.
- Auto Run / batch execution concepts and queue UI patterns.

## Web Interface
- Maestro includes a web/mobile interface in `src/web/` (PWA).
- Web client communicates via WebSocket with a local server in main process.
- This can be a starting point for a **web-first** Maestro-style UI.

## Integration Hooks for Beads + Codex
- ProcessManager already handles spawning CLI tools with stdout/stderr capture.
- IPC services could be adapted to:
  - Call `bd` CLI to list/claim/close beads.
  - Spawn `codex` CLI per bead with concurrency limits.
  - Stream logs to the UI.

## Adaptation Notes
- We want a **web UI**, not Electron-only. Options:
  1) Reuse `src/web/` as the UI shell and create a local runner service.
  2) Extract renderer UI components and mount in a web Vite app.
- Runner can be a Node service that exposes HTTP/WebSocket to the UI.
- Keep Maestro UI look/feel while wiring to beads + Codex runner.

## Relevant Maestro Modules (from ARCHITECTURE.md)
- `src/main/process-manager.ts`: spawns PTY and child processes; emits data/exit events.
- `src/main/web-server.ts`: Fastify HTTP/WebSocket server used by web/PWA client.
- `src/renderer/services/process.ts`: IPC wrapper for process management.
- `src/web/`: PWA client with WebSocket hooks (`useWebSocket`) and session state.
- `src/renderer/constants/themes.ts`: theme system for UI consistency.

## Suggested Integration Path
- Stand up a **local runner** (Node) that owns Codex process spawning and log capture.
- Expose HTTP + WebSocket endpoints (aligns with Maestro web client model).
- Use Maestro web UI patterns (three-panel layout, status badges, log viewer).
