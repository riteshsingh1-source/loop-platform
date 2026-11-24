import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const publicRoot = join(root, "apps/web/public");
await rm(publicRoot, { recursive: true, force: true });
await mkdir(publicRoot, { recursive: true });

async function copyTree(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || entry.name === "media" || entry.name === "server.mjs") continue;
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) await copyTree(from, to);
    else await cp(from, to);
  }
}

await copyTree(join(root, "apps/player-demo"), join(publicRoot, "apps/player-demo"));
await copyTree(join(root, "apps/studio"), join(publicRoot, "apps/studio"));
await cp(join(root, "packages/player-sdk/dist"), join(publicRoot, "packages/player-sdk/dist"), { recursive: true });
console.log(`Prepared static preview files in ${relative(root, publicRoot)}`);
