#!/usr/bin/env python3
"""
VibeCode Pre-Compact State Save

PreCompact hook that saves a backup of the current state before
Claude's context is compacted. This preserves critical workflow
information that might be lost during summarization.
"""

import sys
import os
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager


def main():
    manager = get_manager()

    # Create backup before compaction
    backup_path = manager.backup(reason="pre_compact")

    # Log the compaction event
    manager.state["session"]["last_compact"] = datetime.now().isoformat()
    manager.save()

    print(f"""
================================================================
            VIBECODE STATE SAVED (PRE-COMPACT)
================================================================
Backup: {str(backup_path) if backup_path else 'None'}
Step: {manager.get_current_step()}
Bead: {manager.state.get('current_bead_id', 'None')}
----------------------------------------------------------------
State will be reloaded at next session start.
Use `reload-state.py` to manually restore if needed.
================================================================
""")

    sys.exit(0)


if __name__ == "__main__":
    main()
