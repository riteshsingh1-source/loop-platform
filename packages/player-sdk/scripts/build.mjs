import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(root, "../..");
const source = await readFile(resolve(root, "src/loop-player.js"), "utf8");
const hls = await readFile(resolve(workspaceRoot, "node_modules/hls.js/dist/hls.min.js"), "utf8");
const banner = `/*! LOOP Player SDK v0.1.0 | ${new Date().toISOString()} */\n`;

await mkdir(resolve(root, "dist"), { recursive: true });
await writeFile(resolve(root, "dist/loop-player.js"), banner + hls + "\n" + source);
await copyFile(resolve(workspaceRoot, "node_modules/hls.js/dist/hls.min.js"), resolve(root, "dist/hls.min.js"));

console.log("Built self-contained dist/loop-player.js and optional dist/hls.min.js");
