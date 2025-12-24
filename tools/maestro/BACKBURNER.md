# Backburner Features

This document tracks dormant features that are implemented but disabled via feature flags. These features may be re-enabled in future releases.

## LLM Settings Panel

**Status:** Disabled
**Feature Flag:** `FEATURE_FLAGS.LLM_SETTINGS` in `src/renderer/components/SettingsModal.tsx`
**Disabled Date:** 2024-11-26

### Description

The LLM Settings panel provides configuration options for connecting to various LLM providers directly from Maestro. This feature was designed to enable a built-in AI assistant for the scratchpad or other future AI-powered features within the application.

### Supported Providers

- **OpenRouter** - API proxy supporting multiple models
- **Anthropic** - Direct Claude API access
- **Ollama** - Local LLM inference

### Configuration Options

- LLM Provider selection
- Model slug/identifier
- API key (stored locally)
- Connection test functionality

### Files Involved

- `src/renderer/components/SettingsModal.tsx` - Main settings UI with LLM tab
- Settings stored in electron-store: `llmProvider`, `modelSlug`, `apiKey`

### Re-enabling

To re-enable this feature:

1. Open `src/renderer/components/SettingsModal.tsx`
2. Find the `FEATURE_FLAGS` constant at the top of the file
3. Set `LLM_SETTINGS: true`

```typescript
const FEATURE_FLAGS = {
  LLM_SETTINGS: true,  // LLM provider configuration (OpenRouter, Anthropic, Ollama)
};
```

### Reason for Disabling

Currently not in use as Maestro focuses on managing external AI coding agents (Claude Code, etc.) rather than providing built-in LLM functionality. May be re-enabled when there's a use case for direct LLM integration within Maestro.
