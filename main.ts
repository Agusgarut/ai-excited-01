// ai-excited-01: hand the entry image over to the grader.
// The picture lives next to this file; the grader tells us where
// to put it through MAKEFUN_OUTPUT_DIR (or /output when unset).
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const picturePath = join(here, "entry.png");

if (!existsSync(picturePath)) {
  throw new Error("no entry.png found beside main.ts — nothing to hand over");
}

const picture = readFileSync(picturePath);
const byteCount = picture.length;
if (byteCount < 1 || byteCount > 1048576) {
  throw new Error(`entry.png is ${byteCount} bytes; the limit is 1..1048576`);
}

// A second look at the file on disk, so a half-written or
// swapped image is caught before anything is handed over.
if (statSync(picturePath).size !== byteCount) {
  throw new Error("entry.png changed size while it was being read — refusing to hand over a torn file");
}

const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(targetDir, "entry.png");
writeFileSync(targetPath, picture);

const written = statSync(targetPath).size;
if (written !== byteCount) {
  throw new Error(`wrote ${written} bytes to ${targetPath}, expected ${byteCount}`);
}
