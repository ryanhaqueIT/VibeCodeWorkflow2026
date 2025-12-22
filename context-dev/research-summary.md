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
