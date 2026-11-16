// ai-excited-01 entry: copy the original image beside this file to the
// grader's output directory. Node 22, standard library only, no network.
// The image is original work under the MIT license (see LICENSE, which
// carries an SPDX-License-Identifier: MIT line for the entry check).
import { copyFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const source = new URL("./entry.png", import.meta.url);
if (!existsSync(source)) {
  throw new Error("entry.png is missing next to main.ts");
}
const size = statSync(source).size;
if (size === 0 || size > 1048576) {
  throw new Error(`entry.png is ${size} bytes, must be 1..1048576 bytes`);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const dest = join(outDir, "entry.png");
try {
  copyFileSync(source, dest);
} catch (err) {
  throw new Error(`could not write ${dest}: ${(err as Error).message}`);
}
// Verify the copy landed byte-for-byte: same size as the source image.
if (statSync(dest).size !== size) {
  throw new Error("entry.png copy size does not match the source");
}
