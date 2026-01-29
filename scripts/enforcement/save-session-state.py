#!/usr/bin/env python3
"""
VibeCode Session End State Save

Stop hook that saves the final session state when Claude's
conversation ends. Ensures state is preserved for next session.
"""

import sys
import os
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager


def main():
    manager = get_manager()

    # Create backup at session end
    backup_path = manager.backup(reason="session_end")

    # Update session metadata
    manager.state["session"]["ended_at"] = datetime.now().isoformat()
    manager.save()

    print(f"""
================================================================
            VIBECODE SESSION STATE SAVED
================================================================
Final Step: {manager.get_current_step()}
Bead: {manager.state.get('current_bead_id', 'None')}
State will be restored on next session start.
================================================================
""")

    sys.exit(0)


if __name__ == "__main__":
    main()
