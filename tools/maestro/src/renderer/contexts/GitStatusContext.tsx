import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useGitStatusPolling } from '../hooks/useGitStatusPolling';
import type { GitStatusData, GitFileChange, UseGitStatusPollingOptions } from '../hooks/useGitStatusPolling';
import type { Session } from '../types';

/**
 * Git status context value exposed to consumers.
 */
export interface GitStatusContextValue {
  /**
   * Map of session ID to git status data.
   * Only sessions that are git repos will have entries.
   */
  gitStatusMap: Map<string, GitStatusData>;
  /**
   * Manually trigger a refresh of git status for all sessions.
   * Useful when you know files have changed and want immediate feedback.
   */
  refreshGitStatus: () => Promise<void>;
  /**
   * Whether the hook is currently loading data.
   */
  isLoading: boolean;
  /**
   * Get the file count for a specific session (convenience method).
   * Returns 0 if session is not found or not a git repo.
   */
  getFileCount: (sessionId: string) => number;
  /**
   * Get the full git status data for a specific session.
   * Returns undefined if session is not found or not a git repo.
   */
  getStatus: (sessionId: string) => GitStatusData | undefined;
}

// Create context with null as default (will throw if used outside provider)
const GitStatusContext = createContext<GitStatusContextValue | null>(null);

interface GitStatusProviderProps {
  children: ReactNode;
  /** Array of all sessions to poll */
  sessions: Session[];
  /** ID of the currently active session */
  activeSessionId?: string;
  /** Optional polling options override */
  options?: Omit<UseGitStatusPollingOptions, 'activeSessionId'>;
}

/**
 * GitStatusProvider - Provides centralized git status polling for all sessions.
 *
 * This provider consolidates git polling that was previously scattered across:
 * - SessionList.tsx (file counts for all sessions)
 * - MainPanel.tsx (branch, remote, ahead/behind for active session)
 * - GitStatusWidget.tsx (numstat file changes for active session)
 *
 * By centralizing git polling:
 * - Git process spawns are reduced by ~66% (3x → 1x per poll cycle)
 * - All git UI elements see consistent, synchronized data
 * - Detailed numstat data is only fetched for the active session (optimization)
 *
 * Usage:
 * Wrap the part of your app that needs git status in this provider:
 * <GitStatusProvider sessions={sessions} activeSessionId={activeSessionId}>
 *   <SessionList />
 *   <MainPanel />
 * </GitStatusProvider>
 */
export function GitStatusProvider({
  children,
  sessions,
  activeSessionId,
  options = {},
}: GitStatusProviderProps) {
  const { gitStatusMap, refreshGitStatus, isLoading } = useGitStatusPolling(sessions, {
    ...options,
    activeSessionId,
  });

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<GitStatusContextValue>(() => ({
    gitStatusMap,
    refreshGitStatus,
    isLoading,
    getFileCount: (sessionId: string) => gitStatusMap.get(sessionId)?.fileCount ?? 0,
    getStatus: (sessionId: string) => gitStatusMap.get(sessionId),
  }), [gitStatusMap, refreshGitStatus, isLoading]);

  return (
    <GitStatusContext.Provider value={contextValue}>
      {children}
    </GitStatusContext.Provider>
  );
}

/**
 * useGitStatus - Hook to access the git status context.
 *
 * Must be used within a GitStatusProvider. Throws an error if used outside.
 *
 * @returns GitStatusContextValue - Git status data and refresh function
 *
 * @example
 * const { gitStatusMap, refreshGitStatus, getFileCount } = useGitStatus();
 *
 * // Get file count for a session
 * const fileCount = getFileCount(sessionId);
 *
 * // Get full status data for active session
 * const status = gitStatusMap.get(activeSessionId);
 * if (status?.fileChanges) {
 *   // Render detailed file changes
 * }
 *
 * // Trigger manual refresh
 * await refreshGitStatus();
 */
export function useGitStatus(): GitStatusContextValue {
  const context = useContext(GitStatusContext);

  if (!context) {
    throw new Error('useGitStatus must be used within a GitStatusProvider');
  }

  return context;
}

// Re-export types for convenience
export type { GitStatusData, GitFileChange };
