# VibeCodeWorkflow2026

## Workflow

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     OUTCOMES (ARTIFACTS)                                      │
│   spec.md     plan.md     rules.md     context-pack.md     tests/     commits/     PR/merge   │
│                                         (per task)       checks       history                 │
└───────────────────────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 0) START: Problem / Idea                                                                      │
│    WHAT: Define the problem statement and boundaries                                          │
│    WHY: Prevent vague prompting that causes drift                                             │
│    OUTPUT: 1–3 sentence problem statement                                                     │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1) OUTCOME + CONSTRAINTS DISCOVERY (AI asks you questions)                                    │
│    [H↔AI] "Ask me questions until requirements + edge cases are clear."                       │
│    WHAT: Clarify success criteria, non-goals, constraints, risks, edge cases                  │
│    WHY: Forces shared understanding; reduces hallucination + rework                           │
│    OUTPUT: Requirements list + edge cases + invariants                                        │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2) WRITE spec.md (from the Q&A)                                                               │
│    [AI drafts] [H edits/approves]                                                             │
│    WHAT: Consolidate into spec.md: requirements, architecture, data model, test strategy      │
│    WHY: Gives a stable “source of truth” for all later steps                                  │
│    OUTPUT: spec.md                                                                            │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3) GENERATE plan.md FROM spec.md                                                              │
│    [H→AI] "Read spec.md. Produce step-by-step plan with milestones + definition of done."     │
│    WHAT: Break work into small tasks; define acceptance per task                              │
│    WHY: Enables chunking; keeps execution controlled                                          │
│    OUTPUT: plan.md                                                                            │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 4) PLAN CRITIQUE + REFINEMENT LOOP                                                            │
│    [H↔AI] "Critique plan.md for gaps/risks. Improve sequencing. Add missing tests."           │
│    WHAT: Iteratively refine plan until coherent + complete                                    │
│    WHY: Fixes issues before code exists; cheaper than refactoring later                       │
│    OUTPUT: Updated plan.md + test checklist per step                                          │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 5) RULES / STYLE / GUARDRAILS (project-level)                                                 │
│    [H] Create rules.md (or CLAUDE.md/GEMINI.md/Cursor rules)                                  │
│    WHAT: Coding conventions, forbidden patterns, “if unsure ask”, how to run tests            │
│    WHY: Consistent code + less drift; reduces re-explaining every prompt                      │
│    OUTPUT: rules.md                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v

        ┌────────────────────────────────────────────────────────────────────────────┐
        │                 EXECUTION PHASE: SMALL CHUNKS (Step N loop)                │
        └────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 6) SELECT STEP N (from plan.md)                                                               │
│    [H] Choose one small task: implement 1 function, fix 1 bug, add 1 feature                  │
│    WHAT: Lock scope for this iteration                                                        │
│    WHY: LLMs perform best on focused prompts; you can understand output                       │
│    OUTPUT: “Task card” (goal + done criteria)                                                 │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 7) CONTEXT PACKING AGENT (per task)                                                           │
│    [H+AI] “Context pack for Step N only”                                                      │
│    WHAT: Provide relevant code + interfaces + constraints + pitfalls                          │
│         - files to modify / reference                                                         │
│         - invariants & non-goals                                                              │
│         - relevant docs / API snippets                                                        │
│         - MCP servers / tooling: Context7, Chrome DevTools MCP (if UI), etc                   │
│         - repo bundling: gitingest / repo2txt (dump relevant subset)                          │
│    WHY: Prevents guessing; improves correctness + fit; saves tokens by focusing               │
│    OUTPUT: context-pack.md (or prompt context bundle)                                         │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 8) IMPLEMENT STEP N (AI pair programmer)                                                      │
│    [H→AI] Prompt includes: spec.md references + plan step + rules.md + context-pack           │
│    WHAT: Generate/modify code for Step N only                                                 │
│    WHY: Controlled change set; easy to review                                                 │
│    OUTPUT: Code changes (small diff)                                                          │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 9) RUN TESTS / CHECKS (automated loop)                                                        │
│    [AI or H triggers]  [CI] runs unit tests, lint, typecheck, build                           │
│    WHAT: Execute the verification gates                                                       │
│    WHY: AI “sounds right” even when wrong; tests are the safety net                           │
│    OUTPUT: Pass/Fail logs                                                                     │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                         │
                         v
                 ┌──────────────────────────────┐
                 │ 10) GREEN?                   │
                 └──────────────────────────────┘
                      │               │
                    NO│               │YES
                      v               v
┌──────────────────────────────────────────────────────────────────────┐   ┌──────────────────────────────────────────────────────┐
│ 11) DEBUG WITH LOGS (tight feedback loop)                            │   │ 12) HUMAN REVIEW (accountability gate)               │
│    [H↔AI] Paste failures + traces; AI proposes fix; re-run checks    │   │  - Can you explain it?                               │
│    WHY: AI excels at iterate→test→fix when logs are provided         │   │  - Is it simple/maintainable?                        │
│    OUTPUT: Updated code until green                                  │   │  OUTPUT: Approved diff (or request simplification)   │
└──────────────────────────────────────────────────────────────────────┘   └──────────────────────────────────────────────────────┘
                      │                                                       │
                      └───────────────(back to step 9)────────────────────────┘
                                                      │
                                                      v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 13) OPTIONAL SECOND MODEL REVIEW (quality/security/perf)                                      │
│    [AI reviewer] Different model critiques diffs + suggests improvements                      │
│    WHY: “Second opinion” catches what first model missed                                      │
│    OUTPUT: Review notes + patch suggestions                                                   │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                                                      │
                                                      v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 14) COMMIT (save point)                                                                       │
│    [H] Small commit, clear message. Never commit what you can’t explain                       │
│    WHY: Rollback safety net; audit trail for AI changes                                       │
│    OUTPUT: Clean git history                                                                  │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
                                                      │
                                                      v
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 15) NEXT STEP?                                                                                │
│    If plan.md has more steps → loop to Step 6                                                 │
│    If done → PR/Merge with CI gates + review                                                  │
│    OUTPUT: PR/merge + shipped increment                                                       │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```