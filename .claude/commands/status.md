---
description: Check current VibeCode workflow state and step
allowed-tools: ["Bash", "Read"]
---

# VibeCode Status Check

Check the current workflow state:

```bash
python scripts/enforcement/vibe-cli.py status
```

Then report:
1. Current step number and name
2. Whether code editing is allowed
3. Any pending gate requirements
4. Recommended next action
