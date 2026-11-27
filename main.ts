// Hartono Budget hand-in (Node 22, standard library only).
//
// The site lives in app/ as plain static files — index.html plus its own
// JS and CSS, nothing fetched from the network. This program copies app/
// and screenshots/ into the output directory and writes dossier.json,
// the summary the judge reads, using the vendored make.fun library.
// vendor/makefun-frontend.ts is the kit's copy, unchanged: the scorer
// rebuilds the dossier with its own copy and compares byte for byte.
//
// Local run:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader the output directory is /output.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from an empty output directory so a stale file from an earlier
// run can never leak into the hand-in.
if (existsSync(outDir)) {
  for (const entry of readdirSync(outDir)) rmSync(join(outDir, entry), { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Caps mirror the scorer's gate: at most 4 screenshots of 256 KiB, app/
// within 993 entries / 16 MiB, dossier text capped at 160 KiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
