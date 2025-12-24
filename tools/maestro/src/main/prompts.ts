/**
 * Prompt loader for the main process.
 *
 * This module reads prompt markdown files from src/prompts/ at runtime.
 * Unlike the renderer (which uses Vite's ?raw imports), the main process
 * uses Node.js fs to read files synchronously at module load time.
 *
 * This ensures all prompts live in src/prompts/ as markdown files for
 * easy discovery and editing, while still being usable in the main process.
 */

import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

/**
 * Resolves the path to a prompt file.
 * In development, reads from src/prompts/
 * In production, reads from the app's resources
 */
function getPromptsDir(): string {
  // In development, __dirname is dist/main, so go up to project root
  // In production, we need to handle the packaged app structure
  const isDev = !app.isPackaged;

  if (isDev) {
    // Development: src/prompts is relative to project root
    return path.resolve(__dirname, '../../src/prompts');
  } else {
    // Production: prompts are copied to resources
    return path.join(process.resourcesPath, 'prompts');
  }
}

/**
 * Reads a prompt file and returns its contents.
 * Throws an error if the file doesn't exist.
 */
function loadPrompt(filename: string): string {
  const promptsDir = getPromptsDir();
  const filePath = path.join(promptsDir, filename);

  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    // In production, if the file is missing, provide a helpful error
    throw new Error(
      `Failed to load prompt file: ${filename}. ` +
      `Expected at: ${filePath}. ` +
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Group Chat Prompts
export const groupChatModeratorSystemPrompt = loadPrompt('group-chat-moderator-system.md');
export const groupChatModeratorSynthesisPrompt = loadPrompt('group-chat-moderator-synthesis.md');
export const groupChatParticipantPrompt = loadPrompt('group-chat-participant.md');
export const groupChatParticipantRequestPrompt = loadPrompt('group-chat-participant-request.md');
