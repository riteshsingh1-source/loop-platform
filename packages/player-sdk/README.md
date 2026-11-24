# LOOP Player SDK

The player is a web component in the LOOP page markup. The SDK script registers `<loop-player>` and provides the floating-player continuity used by PiP; it does not create the regular inline player from script configuration.

```html
<script defer src="https://cdn.example.com/loop-player.js"></script>

<loop-player
  src="https://media.example.com/live/event-123/master.m3u8"
  title="Summer live edit"
  host="LOOP LIVE"
  mode="live"
  muted
></loop-player>
```

Component attributes include `src`, `poster`, `title`, `host`, `mode`, `chat-policy`, `products` (JSON), `cues` (JSON), and the featured-card fields `product-title`, `product-description`, `product-action`, and `product-url`. Give a product a same-origin `pipUrl` in the products JSON to make its product-list link minimize the player before navigating. The destination page's SDK script restores it. No page-specific element ID or initialization selector is needed.

For same-origin cross-page PiP, include the SDK script on every destination page. The page with playback declares its `<loop-player>` in markup. Other pages include only the SDK script; the SDK restores a floating player from session state when one was minimized. On a full page load, the browser may require a user gesture to resume playback. `LOOP.close()` clears the saved session.

`window.LOOP` exposes `play`, `pause`, `mute`, `unmute`, `seek`, `goLive`, `fullscreen`, `minimize`, `restore`, `close`, and `nativePiP`. Events use `loop:*` names and versioned detail objects.

Build with `npm --workspace @loop/player-sdk run build`. The deployable artifact is `packages/player-sdk/dist/loop-player.js`; it includes the HLS runtime. Host that SDK artifact on the AWS bucket/CDN and load it with the script tag above.
