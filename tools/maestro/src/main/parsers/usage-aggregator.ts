/**
 * Usage Statistics Aggregator
 *
 * Utility functions for aggregating token usage statistics from AI agents.
 * This module is separate from process-manager to avoid circular dependencies
 * and allow parsers to use it without importing node-pty dependencies.
 */

/**
 * Model statistics from Claude Code modelUsage response
 */
export interface ModelStats {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadInputTokens?: number;
  cacheCreationInputTokens?: number;
  contextWindow?: number;
}

/**
 * Usage statistics extracted from model usage data
 */
export interface UsageStats {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  totalCostUsd: number;
  contextWindow: number;
  /**
   * Reasoning/thinking tokens (separate from outputTokens)
   * Some models like OpenAI o3/o4-mini report reasoning tokens separately.
   * These are already included in outputTokens but tracked separately for UI display.
   */
  reasoningTokens?: number;
}

/**
 * Aggregate token counts from modelUsage for accurate context tracking.
 * modelUsage contains per-model breakdown with actual context tokens (including cache hits).
 * Falls back to top-level usage if modelUsage isn't available.
 *
 * @param modelUsage - Per-model statistics object from Claude Code response
 * @param usage - Top-level usage object (fallback)
 * @param totalCostUsd - Total cost from response
 * @returns Aggregated usage statistics
 */
export function aggregateModelUsage(
  modelUsage: Record<string, ModelStats> | undefined,
  usage: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  } = {},
  totalCostUsd: number = 0
): UsageStats {
  let aggregatedInputTokens = 0;
  let aggregatedOutputTokens = 0;
  let aggregatedCacheReadTokens = 0;
  let aggregatedCacheCreationTokens = 0;
  let contextWindow = 200000; // Default for Claude

  if (modelUsage) {
    for (const modelStats of Object.values(modelUsage)) {
      aggregatedInputTokens += modelStats.inputTokens || 0;
      aggregatedOutputTokens += modelStats.outputTokens || 0;
      aggregatedCacheReadTokens += modelStats.cacheReadInputTokens || 0;
      aggregatedCacheCreationTokens += modelStats.cacheCreationInputTokens || 0;
      // Use the highest context window from any model
      if (modelStats.contextWindow && modelStats.contextWindow > contextWindow) {
        contextWindow = modelStats.contextWindow;
      }
    }
  }

  // Fall back to top-level usage if modelUsage isn't available
  // This handles older CLI versions or different output formats
  if (aggregatedInputTokens === 0 && aggregatedOutputTokens === 0) {
    aggregatedInputTokens = usage.input_tokens || 0;
    aggregatedOutputTokens = usage.output_tokens || 0;
    aggregatedCacheReadTokens = usage.cache_read_input_tokens || 0;
    aggregatedCacheCreationTokens = usage.cache_creation_input_tokens || 0;
  }

  return {
    inputTokens: aggregatedInputTokens,
    outputTokens: aggregatedOutputTokens,
    cacheReadInputTokens: aggregatedCacheReadTokens,
    cacheCreationInputTokens: aggregatedCacheCreationTokens,
    totalCostUsd,
    contextWindow,
  };
}
