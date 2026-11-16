import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "./entry.png";
const LIMIT = 1048576;

function fail(message: string): never {
  console.error(`entry failed: ${message}`);
  process.exit(1);
}

if (!existsSync(SRC)) fail("entry.png is missing next to main.ts — it must sit at the repository root");

const info = statSync(SRC);
if (info.size < 1 || info.size > LIMIT) {
  fail(`entry.png must be between 1 and 1048576 bytes, got ${info.size}`);
}

const payload = readFileSync(SRC);
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(targetDir, { recursive: true });
const target = join(targetDir, "entry.png");
writeFileSync(target, payload);

const written = statSync(target);
if (written.size !== payload.length) {
  fail(`wrote ${written.size} bytes but expected ${payload.length}`);
}
console.log(`shipped entry.png (${payload.length} bytes) to ${target}`);
