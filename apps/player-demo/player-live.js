(() => {
  const mount = document.getElementById("loop-player-mount");
  let activeSource = "";
  const fallbackVodPlaybackUrl = "https://d22zjoamwa62fa.cloudfront.net/media/loop-live-source.mp4";

  function show(status) {
    const source = status.live ? status.ivsPlaybackUrl : status.vodPlaybackUrl;
    if (source !== activeSource) {
      const player = document.createElement("loop-player");
      player.setAttribute("src", source);
      player.setAttribute("title", "The art of a slower morning");
      player.setAttribute("host", "LOOP LIVE · Ananya Mehta");
      player.setAttribute("mode", status.live ? "live" : "replay");
      player.setAttribute("muted", "");
      player.setAttribute("playsinline", "");
      player.setAttribute("product-title", "Redmi Note 14 Pro+ 5G");
      player.setAttribute("product-description", "View this featured product");
      player.setAttribute("product-action", "View product ↗");
      player.setAttribute("product-url", "/apps/player-demo/page-b.html");
      player.setAttribute("products", JSON.stringify([
        { id: "personal-loan-1", name: "Personal Loan", price: "Apply online", url: "https://www.bajajfinserv.in/personal-loan?utm_source=soco_social&utm_medium=social_organic_live_fireworks&utm_campaign=soco_social_live_organic_fireworks" },
        { id: "redmi-note-14-1", name: "Redmi Note 14 Pro+ 5G · 128 GB · Spectre Blue", price: "8 GB RAM", url: "https://www.bajajfinserv.in/bmall/redmi-note-14-pro-plus-5g-128-gb-storage-spectre-blue-8-gb-ram-smartphone/p/29185?utm_source=soco_social&utm_medium=social_organic_live_fireworks&utm_campaign=soco_social_live_organic_fireworks", pipUrl: "/apps/player-demo/page-b.html" },
      ]));
      mount.replaceChildren(player);
      activeSource = source;
    }
    mount.dataset.streamState = status.state;
    mount.setAttribute("aria-label", status.live ? "LOOP live stream" : "LOOP replay");
  }

  async function refresh() {
    try {
      const response = await fetch("/api/status");
      if (!response.ok) throw new Error("Video status is unavailable");
      const status = await response.json();
      show(status);
    } catch {
      if (!activeSource) show({ state: "replay-preview", live: false, vodPlaybackUrl: fallbackVodPlaybackUrl });
    }
  }

  refresh();
  setInterval(refresh, 10000);
})();
