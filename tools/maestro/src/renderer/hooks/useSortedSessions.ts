import { useMemo } from 'react';
import type { Session, Group } from '../types';
import {
  stripLeadingEmojis,
  compareNamesIgnoringEmojis,
} from '../../shared/emojiUtils';

// Re-export for backwards compatibility with existing imports
export { stripLeadingEmojis, compareNamesIgnoringEmojis };

/**
 * Dependencies for the useSortedSessions hook.
 */
export interface UseSortedSessionsDeps {
  /** All sessions */
  sessions: Session[];
  /** All groups */
  groups: Group[];
  /** Whether the bookmarks folder is collapsed */
  bookmarksCollapsed: boolean;
}

/**
 * Return type for useSortedSessions hook.
 */
export interface UseSortedSessionsReturn {
  /** All sessions sorted by group then alphabetically (ignoring leading emojis) */
  sortedSessions: Session[];
  /**
   * Sessions visible for jump shortcuts (Opt+Cmd+NUMBER).
   * Order: Bookmarked sessions first (if bookmarks expanded), then expanded groups/ungrouped.
   * Note: A session may appear twice if bookmarked and in an expanded group.
   */
  visibleSessions: Session[];
}

/**
 * Hook for computing sorted and visible session lists.
 *
 * This hook handles:
 * 1. sortedSessions - All sessions sorted by group membership, then alphabetically
 *    (ignoring leading emojis for proper alphabetization)
 * 2. visibleSessions - Sessions visible for keyboard shortcuts (Opt+Cmd+NUMBER),
 *    respecting bookmarks folder state and group collapse states
 *
 * @param deps - Hook dependencies containing sessions, groups, and collapse state
 * @returns Sorted and visible session arrays
 */
export function useSortedSessions(deps: UseSortedSessionsDeps): UseSortedSessionsReturn {
  const { sessions, groups, bookmarksCollapsed } = deps;

  // Helper to get worktree children for a session
  const getWorktreeChildren = (parentId: string) =>
    sessions.filter(s => s.parentSessionId === parentId)
      .sort((a, b) => compareNamesIgnoringEmojis(a.worktreeBranch || a.name, b.worktreeBranch || b.name));

  // Create sorted sessions array that matches visual display order (includes ALL sessions)
  // Note: sorting ignores leading emojis for proper alphabetization
  // Worktree children are inserted after their parent when the parent's worktrees are expanded
  const sortedSessions = useMemo(() => {
    const sorted: Session[] = [];

    // Helper to add session with its worktree children
    const addSessionWithWorktrees = (session: Session) => {
      // Skip worktree children - they're added with their parent
      if (session.parentSessionId) return;

      sorted.push(session);

      // Add worktree children if expanded
      if (session.worktreesExpanded !== false) {
        const children = getWorktreeChildren(session.id);
        sorted.push(...children);
      }
    };

    // First, add sessions from sorted groups (ignoring leading emojis)
    const sortedGroups = [...groups].sort((a, b) => compareNamesIgnoringEmojis(a.name, b.name));
    sortedGroups.forEach(group => {
      const groupSessions = sessions
        .filter(s => s.groupId === group.id && !s.parentSessionId)
        .sort((a, b) => compareNamesIgnoringEmojis(a.name, b.name));
      groupSessions.forEach(addSessionWithWorktrees);
    });

    // Then, add ungrouped sessions (sorted alphabetically, ignoring leading emojis)
    const ungroupedSessions = sessions
      .filter(s => !s.groupId && !s.parentSessionId)
      .sort((a, b) => compareNamesIgnoringEmojis(a.name, b.name));
    ungroupedSessions.forEach(addSessionWithWorktrees);

    return sorted;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, groups]);

  // Create visible sessions array for session jump shortcuts (Opt+Cmd+NUMBER)
  // Order: Bookmarked sessions first (if bookmarks folder expanded), then groups/ungrouped
  // Note: A session can appear twice if it's both bookmarked and in an expanded group
  const visibleSessions = useMemo(() => {
    const result: Session[] = [];

    // Add bookmarked sessions first (if bookmarks folder is expanded)
    if (!bookmarksCollapsed) {
      const bookmarkedSessions = sessions
        .filter(s => s.bookmarked)
        .sort((a, b) => compareNamesIgnoringEmojis(a.name, b.name));
      result.push(...bookmarkedSessions);
    }

    // Add sessions from expanded groups and ungrouped sessions
    const groupAndUngrouped = sortedSessions.filter(session => {
      if (!session.groupId) return true; // Ungrouped sessions always visible
      const group = groups.find(g => g.id === session.groupId);
      return group && !group.collapsed; // Only show if group is expanded
    });
    result.push(...groupAndUngrouped);

    return result;
  }, [sortedSessions, groups, sessions, bookmarksCollapsed]);

  return {
    sortedSessions,
    visibleSessions,
  };
}
