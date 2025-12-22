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
