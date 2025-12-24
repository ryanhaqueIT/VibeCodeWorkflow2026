import { useState, useEffect, useRef } from 'react';
import { X, GitBranch, FolderOpen, Plus, Loader2, AlertTriangle } from 'lucide-react';
import type { Theme, Session, GhCliStatus } from '../types';
import { useLayerStack } from '../contexts/LayerStackContext';
import { MODAL_PRIORITIES } from '../constants/modalPriorities';

interface WorktreeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  session: Session;
  // Callbacks
  onSaveConfig: (config: { basePath: string; watchEnabled: boolean }) => void;
  onCreateWorktree: (branchName: string, basePath: string) => void;
}

/**
 * WorktreeConfigModal - Modal for configuring worktrees on a parent session
 *
 * Features:
 * - Set worktree base directory
 * - Toggle file watching
 * - Create new worktree with branch name
 */
export function WorktreeConfigModal({
  isOpen,
  onClose,
  theme,
  session,
  onSaveConfig,
  onCreateWorktree,
}: WorktreeConfigModalProps) {
  const { registerLayer, unregisterLayer } = useLayerStack();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Form state
  const [basePath, setBasePath] = useState(session.worktreeConfig?.basePath || '');
  const [watchEnabled, setWatchEnabled] = useState(session.worktreeConfig?.watchEnabled ?? true);
  const [newBranchName, setNewBranchName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // gh CLI status
  const [ghCliStatus, setGhCliStatus] = useState<GhCliStatus | null>(null);

  // Register with layer stack for Escape handling
  useEffect(() => {
    if (isOpen) {
      const id = registerLayer({
        type: 'modal',
        priority: MODAL_PRIORITIES.WORKTREE_CONFIG,
        onEscape: () => onCloseRef.current(),
        blocksLowerLayers: true,
        capturesFocus: true,
        focusTrap: 'lenient',
      });
      return () => unregisterLayer(id);
    }
  }, [isOpen, registerLayer, unregisterLayer]);

  // Check gh CLI status and load config on open
  useEffect(() => {
    if (isOpen) {
      checkGhCli();
      setBasePath(session.worktreeConfig?.basePath || '');
      setWatchEnabled(session.worktreeConfig?.watchEnabled ?? true);
      setNewBranchName('');
      setError(null);
    }
  }, [isOpen, session.worktreeConfig]);

  const checkGhCli = async () => {
    try {
      const status = await window.maestro.git.checkGhCli();
      setGhCliStatus(status);
    } catch {
      setGhCliStatus({ installed: false, authenticated: false });
    }
  };

  const handleBrowse = async () => {
    const result = await window.maestro.dialog.selectFolder();
    if (result) {
      setBasePath(result);
    }
  };

  const handleSave = () => {
    if (!basePath.trim()) {
      setError('Please select a worktree directory');
      return;
    }
    onSaveConfig({ basePath: basePath.trim(), watchEnabled });
    onClose();
  };

  const handleCreateWorktree = async () => {
    if (!basePath.trim()) {
      setError('Please select a worktree directory first');
      return;
    }
    if (!newBranchName.trim()) {
      setError('Please enter a branch name');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Save config first to ensure it's persisted
      onSaveConfig({ basePath: basePath.trim(), watchEnabled });
      // Then create the worktree, passing the basePath
      await onCreateWorktree(newBranchName.trim(), basePath.trim());
      setNewBranchName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create worktree');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-lg shadow-2xl border max-h-[80vh] flex flex-col"
        style={{
          backgroundColor: theme.colors.bgSidebar,
          borderColor: theme.colors.border,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: theme.colors.border }}
        >
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" style={{ color: theme.colors.accent }} />
            <h2 className="font-bold" style={{ color: theme.colors.textMain }}>
              Worktree Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: theme.colors.textDim }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* gh CLI warning */}
          {ghCliStatus !== null && !ghCliStatus.installed && (
            <div
              className="flex items-start gap-2 p-3 rounded border"
              style={{
                backgroundColor: theme.colors.warning + '10',
                borderColor: theme.colors.warning,
              }}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: theme.colors.warning }} />
              <div className="text-sm">
                <p style={{ color: theme.colors.warning }}>GitHub CLI recommended</p>
                <p className="mt-1" style={{ color: theme.colors.textDim }}>
                  Install{' '}
                  <a
                    href="https://cli.github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80"
                    style={{ color: theme.colors.accent }}
                  >
                    GitHub CLI
                  </a>
                  {' '}for best worktree support.
                </p>
              </div>
            </div>
          )}

          {/* Worktree Base Directory */}
          <div>
            <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: theme.colors.textDim }}>
              Worktree Directory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={basePath}
                onChange={(e) => setBasePath(e.target.value)}
                placeholder="/path/to/worktrees"
                className="flex-1 px-3 py-2 rounded border bg-transparent outline-none text-sm"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.textMain,
                }}
              />
              <button
                onClick={handleBrowse}
                className="px-3 py-2 rounded border hover:bg-white/5 transition-colors text-sm flex items-center gap-2"
                style={{ borderColor: theme.colors.border, color: theme.colors.textMain }}
              >
                <FolderOpen className="w-4 h-4" />
                Browse
              </button>
            </div>
            <p className="text-[10px] mt-1" style={{ color: theme.colors.textDim }}>
              Base directory where worktrees will be created
            </p>
          </div>

          {/* Watch Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium" style={{ color: theme.colors.textMain }}>
                Watch for new worktrees
              </div>
              <p className="text-[10px]" style={{ color: theme.colors.textDim }}>
                Auto-detect worktrees created outside Maestro
              </p>
            </div>
            <button
              onClick={() => setWatchEnabled(!watchEnabled)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                watchEnabled ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  watchEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: theme.colors.border }} />

          {/* Create New Worktree */}
          <div>
            <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: theme.colors.textDim }}>
              Create New Worktree
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newBranchName.trim()) {
                    handleCreateWorktree();
                  }
                }}
                placeholder="feature-xyz"
                className="flex-1 px-3 py-2 rounded border bg-transparent outline-none text-sm"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.textMain,
                }}
                disabled={!basePath || isCreating}
              />
              <button
                onClick={handleCreateWorktree}
                disabled={!basePath || !newBranchName.trim() || isCreating}
                className={`px-3 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors ${
                  basePath && newBranchName.trim() && !isCreating
                    ? 'hover:opacity-90'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.accentForeground,
                }}
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded border"
              style={{
                backgroundColor: theme.colors.error + '10',
                borderColor: theme.colors.error,
              }}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: theme.colors.error }} />
              <p className="text-sm" style={{ color: theme.colors.error }}>{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-4 py-3 border-t shrink-0"
          style={{ borderColor: theme.colors.border }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm hover:bg-white/10 transition-colors"
            style={{ color: theme.colors.textMain }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-colors"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.accentForeground,
            }}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorktreeConfigModal;
