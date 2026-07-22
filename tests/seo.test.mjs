import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('llms.txt contains an H1 heading and crawlable Markdown links', async () => {
  const llms = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');
  const markdownLinks = [...llms.matchAll(/\[[^\]]+\]\(https:\/\/[^)]+\)/g)];

  assert.match(llms, /^# [^#\n]+$/m);
  assert.ok(markdownLinks.length > 0);
});
