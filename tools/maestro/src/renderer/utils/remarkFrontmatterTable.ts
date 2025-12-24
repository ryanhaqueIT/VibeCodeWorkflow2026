/**
 * remarkFrontmatterTable - A remark plugin that transforms YAML frontmatter into a styled metadata table.
 *
 * Requires remark-frontmatter to be used first to parse the frontmatter into a YAML AST node.
 * This plugin then transforms that node into an HTML table for display.
 *
 * Example input:
 * ---
 * share_note_link: https://example.com
 * share_note_updated: 2025-05-19T13:15:43-05:00
 * ---
 *
 * Output: A compact two-column table with key/value pairs, styled with smaller font.
 */

import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * Parse simple YAML key-value pairs from frontmatter content.
 * Handles basic YAML syntax (key: value on each line).
 */
function parseYamlKeyValues(yamlContent: string): Array<{ key: string; value: string }> {
  const lines = yamlContent.split('\n');
  const entries: Array<{ key: string; value: string }> = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Match key: value pattern
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();

      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      entries.push({ key, value });
    }
  }

  return entries;
}

/**
 * Check if a value looks like a URL
 */
function isUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generate HTML table from frontmatter entries
 */
function generateTableHtml(entries: Array<{ key: string; value: string }>): string {
  if (entries.length === 0) return '';

  const rows = entries.map(({ key, value }) => {
    const escapedKey = escapeHtml(key);
    let valueHtml: string;

    if (isUrl(value)) {
      // Render URLs as clickable links
      const escapedUrl = escapeHtml(value);
      // Truncate long URLs for display
      const displayUrl = value.length > 50 ? value.substring(0, 47) + '...' : value;
      valueHtml = `<a href="${escapedUrl}" style="color: inherit; text-decoration: underline;" title="${escapedUrl}">${escapeHtml(displayUrl)}</a>`;
    } else {
      valueHtml = escapeHtml(value);
    }

    return `<tr>
      <td style="padding: 2px 8px 2px 0; font-weight: 500; white-space: nowrap; vertical-align: top;">${escapedKey}</td>
      <td style="padding: 2px 0; word-break: break-word;">${valueHtml}</td>
    </tr>`;
  }).join('\n');

  return `<div class="frontmatter-table" style="font-size: 0.75em; opacity: 0.7; margin-bottom: 1em; padding: 8px; border-radius: 4px; background: rgba(128,128,128,0.1);">
    <table style="border-collapse: collapse; width: 100%;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>`;
}

/**
 * The remark plugin - transforms YAML frontmatter nodes into HTML tables
 */
export function remarkFrontmatterTable() {
  return (tree: Root) => {
    visit(tree, 'yaml', (node: any, index, parent) => {
      if (!parent || index === undefined) return;

      const yamlContent = node.value;
      const entries = parseYamlKeyValues(yamlContent);

      if (entries.length === 0) {
        // No valid entries, remove the node entirely
        parent.children.splice(index, 1);
        return index;
      }

      const tableHtml = generateTableHtml(entries);

      // Replace the YAML node with an HTML node
      const htmlNode = {
        type: 'html',
        value: tableHtml,
      };

      parent.children.splice(index, 1, htmlNode);
      return index + 1;
    });
  };
}

export default remarkFrontmatterTable;
