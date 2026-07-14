#!/usr/bin/env node
/**
 * Create a Hostinger upload zip (source only, no secrets/deps/local DB).
 *
 * Excludes:
 *   - node_modules/
 *   - pb_data/ and pb_data backup folders
 *   - .env (keeps .env.example)
 *   - *.log
 *   - .git/, .horizons-baseline/, dist/ (rebuilt on server)
 *
 * Run: npm run package:hostinger
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_NAME = 'memoriamobile-hostinger.zip';
const OUT_PATH = path.join(ROOT, OUT_NAME);

const EXCLUDES = [
  'node_modules',
  '**/node_modules',
  'pb_data',
  '**/pb_data',
  'pb_data.bak-*',
  '**/pb_data.bak-*',
  '.git',
  '.horizons-baseline',
  'dist',
  '**/*.log',
  '.env',
  '**/.env',
  OUT_NAME,
  'app.tar.gz',
];

if (fs.existsSync(OUT_PATH)) {
  fs.unlinkSync(OUT_PATH);
}

const excludeArgs = EXCLUDES.flatMap((pattern) => ['--exclude', pattern]);

// -a = auto compress (zip on Windows), -c create, -f file
const cmd = ['tar', '-a', '-c', '-f', OUT_PATH, ...excludeArgs, '.'].join(' ');

console.log('Creating', OUT_NAME, '...\n');
console.log('Excluded:', EXCLUDES.join(', '), '\n');

execSync(cmd, { cwd: ROOT, stdio: 'inherit' });

const { size } = fs.statSync(OUT_PATH);
const mb = (size / (1024 * 1024)).toFixed(2);

console.log(`\nDone: ${OUT_PATH}`);
console.log(`Size: ${mb} MB`);
console.log('\nIncluded: .env.example files (not real .env secrets)');
console.log('Upload this zip to Hostinger, then run npm install on the server if needed.\n');
