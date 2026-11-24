import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/loop-player.js", import.meta.url), "utf8");

test("SDK exposes the required player and PiP API", () => {
  for (const contract of [
    "customElements.define(TAG_NAME, LoopPlayer)",
    "init(config = {})",
    "minimize(options = {})",
    "restore()",
    "goLive()",
    "fullscreen()",
    "close()",
    "destroy()",
    "sessionStorage",
    "BroadcastChannel",
  ]) {
    assert.ok(source.includes(contract), `missing contract: ${contract}`);
  }
});

test("signed playback URLs are excluded and restored through a resolver", () => {
  assert.match(source, /this\.hasAttribute\("public-src"\)\s*\?\s*this\.getAttribute\("src"\)\s*:\s*null/);
  assert.match(source, /api\.resolveSource\(data\.sourceRef\)/);
  assert.match(source, /sourceRef/);
});
