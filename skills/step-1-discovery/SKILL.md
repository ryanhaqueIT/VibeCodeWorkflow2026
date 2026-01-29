---
name: vibecode-step-1-discovery
description: Step 1 - Discovery questionnaire to clarify requirements
category: workflow
---

# Step 1: Discovery Q&A

You are executing **Step 1** of the VibeCode Lifecycle.

## Objective

Generate a discovery questionnaire to clarify requirements, constraints, edge cases, and non-goals.

## MANDATORY Action

You MUST ask questions. Do NOT accept vague prompts. Your job is to:

1. **Analyze** the problem statement
2. **Identify** missing information
3. **Generate** targeted questions
4. **Iterate** until requirements are crystal clear

## Question Categories

### 1. Functional Requirements
- What should the system DO?
- What inputs does it accept?
- What outputs does it produce?

### 2. Non-Functional Requirements
- Performance constraints?
- Security requirements?
- Scalability needs?

### 3. Edge Cases
- What happens when X fails?
- What about empty inputs?
- What about concurrent access?

### 4. Integration
- What systems does this touch?
- What APIs are involved?
- What data flows are affected?

### 5. Non-Goals (Explicit)
- What are we NOT building?
- What's out of scope?
- What's a future enhancement?

## Template

```markdown
## Discovery Questions

Based on the problem statement, I need clarity on:

### Functional
1. [Question]
2. [Question]

### Technical
1. [Question]
2. [Question]

### Edge Cases
1. [Question]
2. [Question]

### Non-Goals
1. What should we explicitly NOT include?
```

## Gate

Proceed when the user has answered all questions and you can confidently define requirements.

## Output

A requirements list that will feed into `spec.md`:

```markdown
## Requirements Summary

### Must Have
- R1: [Requirement]
- R2: [Requirement]

### Should Have
- R3: [Requirement]

### Won't Have (this iteration)
- R4: [Explicitly excluded]
```

## Next Step

Advance to **Step 2: Write spec.md**.
