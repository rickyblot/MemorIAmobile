#!/usr/bin/env node
/**
 * Compare local project vs original Horizons export (app.tar.gz).
 * Run: npm run horizons:diff
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARCHIVE = path.join(ROOT, 'app.tar.gz');
const BASELINE = path.join(ROOT, '.horizons-baseline');

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.horizons-baseline',
  'pb_data',
  'pb_data.bak-20260710-164147',
  'dist',
  '.cursor',
]);

const IGNORE_FILES = new Set(['package-lock.json', 'app.tar.gz', 'pocketbase.exe']);

const SKIP_PATH_RE = /pb_data|\.exe$/i;

function ensureBaseline() {
  if (!fs.existsSync(ARCHIVE)) {
    console.error('Missing app.tar.gz at repo root (original Horizons export).');
    process.exit(1);
  }
  fs.rmSync(BASELINE, { recursive: true, force: true });
  fs.mkdirSync(BASELINE, { recursive: true });
  execSync(`tar -xzf "${ARCHIVE}"`, { cwd: BASELINE, stdio: 'pipe' });
}

function hash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function walk(dir, baseDir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(baseDir, full).split(path.sep).join('/');

    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(ent.name)) continue;
      walk(full, baseDir, out);
      continue;
    }

    if (IGNORE_FILES.has(ent.name) || SKIP_PATH_RE.test(rel)) continue;
    if (ent.name === '.env' || ent.name.endsWith('.local')) continue;

    out.push('/' + rel);
  }

  return out.sort();
}

function groupForHorizons(filePath) {
  if (filePath.startsWith('/apps/web/public/')) return 'assets';
  if (filePath.startsWith('/apps/web/')) return 'horizons-web';
  if (filePath.startsWith('/apps/api/')) return 'horizons-api';
  if (
    filePath.endsWith('.example') ||
    filePath === '/README.md' ||
    filePath === '/.env.example' ||
    filePath === '/HOSTINGER_MYSQL.md' ||
    filePath === '/OAUTH_SETUP.md' ||
    filePath === '/HORIZONS_SYNC.md'
  ) {
    return 'docs-only';
  }
  return 'other';
}

ensureBaseline();

const currentFiles = new Set(walk(ROOT, ROOT));
const baselineFiles = new Set(walk(BASELINE, BASELINE));

const created = [...currentFiles].filter((f) => !baselineFiles.has(f));
const deleted = [...baselineFiles].filter((f) => !currentFiles.has(f));
const modified = [];

for (const f of currentFiles) {
  if (!baselineFiles.has(f)) continue;
  const a = path.join(ROOT, f.slice(1));
  const b = path.join(BASELINE, f.slice(1));
  try {
    if (hash(a) !== hash(b)) modified.push(f);
  } catch {
    /* skip unreadable */
  }
}

const buckets = { 'horizons-web': [], 'horizons-api': [], assets: [], 'docs-only': [], other: [] };
for (const list of [created, modified]) {
  for (const f of list) buckets[groupForHorizons(f)].push(f);
}

console.log('\n=== MemorIAmobile vs original Horizons export (app.tar.gz) ===\n');
console.log(`Created:  ${created.length}`);
console.log(`Modified: ${modified.length}`);
console.log(`Deleted:  ${deleted.length}\n`);

function printSection(title, files, symbol) {
  if (!files.length) return;
  console.log(`--- ${title} (${files.length}) ---`);
  for (const f of files) console.log(`  ${symbol} ${f}`);
  console.log('');
}

printSection('COPY TO HORIZONS — Web (Code tab)', [...buckets['horizons-web'].filter((f) => created.includes(f))], '+');
printSection('COPY TO HORIZONS — Web (Code tab)', [...buckets['horizons-web'].filter((f) => modified.includes(f))], '~');
printSection('COPY TO HORIZONS — API (if Code tab has api/)', [...buckets['horizons-api'].filter((f) => created.includes(f) || modified.includes(f))], '•');
printSection('UPLOAD TO HORIZONS — public assets', buckets.assets, '+');
printSection('DOCS — optional', buckets['docs-only'], '•');
printSection('OTHER (review before copying)', buckets.other, '•');

if (deleted.length) {
  console.log('--- REMOVED locally (usually no Horizons action) ---');
  for (const f of deleted) console.log(`  - ${f}`);
  console.log('');
}

console.log('Tip: After first git commit, use `git status` and `git diff --name-only` for day-to-day changes.\n');
