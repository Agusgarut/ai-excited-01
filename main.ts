// The Judge Leans In — entry program for ai-excited-01.
// It ships the finished picture: it reads ./entry.png and writes the
// very same bytes to MAKEFUN_OUTPUT_DIR/entry.png, then double-checks
// the copy really landed byte-for-byte by comparing the sizes.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(outDir, "entry.png");
const ONE_MIB = 1024 * 1024;

if (!existsSync(sourcePath)) {
  throw new Error("entry.png is missing next to main.ts, so there is no entry to ship");
}
const picture = readFileSync(sourcePath);
if (picture.length < 1 || picture.length > ONE_MIB) {
  throw new Error(`entry.png is ${picture.length} bytes, it must be between 1 and 1048576`);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, picture);
const written = readFileSync(targetPath);
if (written.length !== picture.length) {
  throw new Error(`wrote ${written.length} bytes but the picture has ${picture.length}`);
}
console.log(`shipped entry.png (${picture.length} bytes) to ${targetPath}`);
