import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My resignation is effective immediately. I have accepted a position as a former employee, and the benefits are excellent.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const chars = [...LINE];
if (chars.length < 1 || chars.length > 140) {
  throw new Error(`line must be 1-140 characters, got ${chars.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be exactly one line");
}
// Ties break on bytes, so the line must be pure ASCII: bytes equal chars.
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes !== chars.length) {
  throw new Error(`line must be ASCII, got ${bytes} bytes for ${chars.length} chars`);
}
if (bytes > 140) {
  throw new Error(`line must be at most 140 bytes, got ${bytes}`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back check: what landed on disk must be byte-identical to the line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("read-back mismatch: entry.txt differs from the line");
}
