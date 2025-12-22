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
