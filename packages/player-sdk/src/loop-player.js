(() => {
  const TAG_NAME = "loop-player";
  const STORE = "loop-player-session-v1";
  const template = document.createElement("template");
  template.innerHTML = `<style>
    :host{display:block;position:relative;width:100%;aspect-ratio:9/16;max-width:430px;min-width:240px;background:#090b0c;color:#fff;border-radius:18px;overflow:hidden;font:14px/1.4 Inter,system-ui,sans-serif;contain:content;--accent:#ff3d57}
    *{box-sizing:border-box}button{font:inherit;color:inherit;border:0;cursor:pointer}button:focus-visible{outline:2px solid #fff;outline-offset:2px}
    .frame{position:absolute;inset:0;background:#08090a}.video{width:100%;height:100%;object-fit:cover;background:#08090a}.shade{position:absolute;inset:0;background:linear-gradient(180deg,#0008,transparent 22%,transparent 58%,#000b);pointer-events:none}
    .top{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center}.badge{background:#e83a4e;padding:6px 10px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.06em}.badge.replay{background:#ffffff24}.top button,.round{width:40px;height:40px;border-radius:50%;background:#1119;backdrop-filter:blur(12px);font-size:19px}
    .center{position:absolute;inset:40% 0 auto;display:flex;justify-content:center}.play{width:64px;height:64px;border-radius:50%;background:#fff;color:#111;font-size:23px;box-shadow:0 4px 28px #0006}
    .meta{position:absolute;left:16px;right:16px;bottom:70px}.host{font-size:12px;color:#eee}.title{font-weight:750;font-size:20px;line-height:1.2;margin:5px 0 12px;text-shadow:0 2px 10px #000}.product{display:flex;align-items:center;gap:11px;background:#fffffff0;color:#17191a;border-radius:13px;padding:9px 10px;max-width:310px;box-shadow:0 5px 24px #0003}.swatch{width:44px;height:48px;border-radius:8px;background:linear-gradient(145deg,#d5c2a2,#63765f 55%,#262e2a)}.product-info{flex:1;min-width:0}.product-name{font-size:12px;font-weight:700}.price{font-size:11px;color:#64696b;margin-top:2px}.shop{border-radius:9px;background:#151819;color:white;padding:10px 13px;font-size:11px;font-weight:700;white-space:nowrap}
    .controls{position:absolute;bottom:0;left:0;right:0;padding:9px 14px 13px;background:linear-gradient(transparent,#0009);transition:opacity .18s}.is-playing:not(:focus-within):not(:hover) .controls.is-hidden{opacity:0;pointer-events:none}.scrub{width:100%;height:18px;accent-color:var(--accent);cursor:pointer}.control-row{display:flex;align-items:center;justify-content:space-between;gap:6px}.group{display:flex;align-items:center;gap:5px}.control-row button{min-width:40px;min-height:40px;background:transparent;border-radius:50%;font-size:18px}.time{font-size:11px;font-variant-numeric:tabular-nums;color:#eee}.error{position:absolute;inset:auto 12px 85px;background:#241a1b;padding:10px;border-radius:9px;font-size:12px}.resume{display:none;position:absolute;inset:auto 12px 82px;padding:12px;background:#fff;color:#111;border-radius:10px;font-weight:700}.status{position:absolute;top:50%;left:50%;z-index:5;transform:translate(-50%,-50%);padding:10px 14px;border-radius:10px;background:#101311dd;font-size:12px}.status[hidden]{display:none}.pip-host{position:fixed;z-index:2147483000;right:max(16px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));width:min(220px,42vw);aspect-ratio:9/16;max-height:42vh;border-radius:16px;overflow:hidden;background:#08090a;box-shadow:0 12px 48px #0008;touch-action:none}.pip-host loop-player{width:100%;height:100%;aspect-ratio:auto;min-width:0;max-width:none;border-radius:inherit}.pip-host .pip-drag{position:absolute;left:0;right:80px;top:0;height:42px;cursor:grab;z-index:4}.pip-host .meta{bottom:56px;left:9px;right:9px}.pip-host .title{font-size:13px}.pip-host .host,.pip-host .product,.pip-host .scrub,.pip-host .control-row .time,.pip-host .side-panel,.pip-host .sound-prompt{display:none}.pip-host .controls{padding:2px 7px 7px}.pip-host .control-row button{min-width:36px;min-height:36px}.pip-host .top{top:6px;left:7px;right:7px}.pip-host .top button{width:34px;height:34px}.pip-host .center{inset:37% 0 auto}.pip-host .play{width:48px;height:48px}.pip-host .round.full{display:none}
    .stage{position:absolute;inset:0;display:block;padding:0;background:#08090a}.side-panel{display:none;min-width:0;height:min(76vh,680px);background:#1b201e;border:1px solid #ffffff12;border-radius:18px;padding:18px;overflow:auto}.chat-panel[hidden]{display:none!important}.side-panel h2{font-size:14px;margin:0 0 14px}.chat-line{padding:10px 0;border-bottom:1px solid #ffffff12;color:#ddd;font-size:13px}.chat-form{display:flex;gap:6px;margin-top:14px}.chat-form input{min-width:0;width:100%;background:#101311;border:1px solid #ffffff22;color:#fff;border-radius:9px;padding:11px}.chat-form button{background:#ff3d57;border-radius:9px;padding:0 13px}.product-row{display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #ffffff14}.product-thumb{flex:none;width:48px;height:56px;border-radius:8px;background:linear-gradient(145deg,#d5c2a2,#63765f 55%,#262e2a)}.product-link{display:inline-block;margin-top:5px;color:#c6e4d2;font-size:12px;text-decoration:underline}.pin{font-size:10px;color:#ff8494;margin-top:4px}.screen{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;max-width:none;border-radius:inherit;overflow:hidden;background:#08090a}.stage .meta{bottom:76px}.stage .title{font-size:16px}.stage .product{max-width:100%}.sound-prompt{position:absolute;top:58px;left:50%;transform:translateX(-50%);z-index:3;white-space:nowrap;border-radius:99px;background:#111c;padding:9px 13px;font-size:11px}:host(.is-playing) .center,:host(.is-playing) .sound-prompt{display:none}:host(.is-paused) .center{display:flex}:host([data-expanded]){position:fixed;z-index:2147482000;inset:0;width:100vw;height:100dvh;max-width:none;aspect-ratio:auto;border-radius:0}:host(.is-expanded) .stage{inset:0;width:100%;height:100%;display:grid;grid-template-columns:minmax(240px,1fr) minmax(280px,420px) minmax(240px,1fr);gap:clamp(16px,2.5vw,40px);padding:clamp(16px,3vw,48px);background:#101311}:host(.is-expanded) .side-panel{display:block;width:100%;max-width:420px;height:min(82dvh,780px);justify-self:center}:host(.is-expanded) .chat-panel[hidden]{display:none!important}:host(.is-expanded) .screen{position:relative;inset:auto;height:min(86dvh,900px);width:auto;aspect-ratio:9/16;max-width:440px;border-radius:18px}:host(.is-expanded) .meta{bottom:72px}:host(.is-expanded) .product{display:none}:host(.is-expanded) .sound-prompt{display:none}:host([data-floating]) .stage{display:block;inset:0;width:100%;height:100%;padding:0;background:transparent}:host([data-floating]) .screen{position:absolute;inset:0;width:100%;height:100%;max-width:none;aspect-ratio:auto;border-radius:inherit}:host([data-floating]) .side-panel,:host([data-floating]) .product{display:none}:host([data-floating]) .meta{bottom:51px;left:9px;right:9px}:host([data-floating]) .title{font-size:13px}:host([data-floating]) .host,:host([data-floating]) .scrub,:host([data-floating]) .time,:host([data-floating]) .sound-prompt{display:none}:host([data-floating]) .controls{padding:2px 7px 7px}:host([data-floating]) .control-row button{min-width:36px;min-height:36px}:host([data-floating]) .top{top:4px;left:7px;right:7px}:host([data-floating]) .top button{width:34px;height:34px}:host([data-floating]) .center{inset:37% 0 auto}:host([data-floating]) .play{width:48px;height:48px}:host([data-floating]) .full{display:none}
    :host([data-floating]){aspect-ratio:auto;width:100%;height:100%;min-width:0;max-width:none;border-radius:inherit}@media(max-width:760px){:host(.is-expanded) .stage{display:block;padding:0}:host(.is-expanded) .screen{position:absolute;inset:0;height:100%;max-height:none;width:100%;aspect-ratio:auto;border-radius:0}:host(.is-expanded) .side-panel{position:absolute;z-index:6;left:12px;right:12px;bottom:12px;width:calc(100% - 24px);max-width:none;justify-self:stretch;height:min(38dvh,320px);border-radius:18px 18px 12px 12px;background:#171b19f5;backdrop-filter:blur(18px)}:host(.is-expanded) .chat-panel:not([hidden]){display:block}:host(.is-expanded) .product-panel{display:block;top:12px;bottom:auto;height:min(30dvh,260px)}:host{border-radius:0}}@media(max-width:480px){:host{border-radius:0}.title{font-size:18px}}
  </style><div class="stage"><aside class="side-panel chat-panel"><h2>Live chat <span class="chat-count">2.4K</span></h2><div class="chat-messages"><div class="chat-line">✨ This is so beautiful!</div><div class="chat-line">Where can I get the blue one?</div><div class="chat-line">Love the details on this piece</div></div><form class="chat-form"><input aria-label="Write a chat message" placeholder="Say something kind…"><button type="submit" aria-label="Send message">➤</button></form></aside><div class="screen"><video class="video" playsinline preload="metadata"></video><div class="shade"></div><div class="top"><span class="badge">● LIVE</span><button class="close" aria-label="Close player" title="Close">×</button></div><div class="sound-prompt">Tap to watch with sound</div><div class="status" hidden></div><div class="center"><button class="play" aria-label="Play">▶</button></div><div class="meta"><div class="host"></div><div class="title"></div><div class="product"><div class="swatch"></div><div class="product-info"><div class="product-name">Featured pick</div><div class="price">Discover this moment</div><div class="pin"></div></div><button class="shop">Shop now ↗</button></div></div><div class="resume">Tap to resume</div><div class="controls"><input class="scrub" aria-label="Video timeline" type="range" min="0" max="1000" value="0"><div class="control-row"><div class="group"><button class="toggle" aria-label="Pause">Ⅱ</button><button class="mute" aria-label="Unmute">◖</button><span class="time">0:00 / 0:00</span><span class="live-offset" hidden></span></div><div class="group"><button class="speed" aria-label="Playback speed" hidden>1×</button><button class="heart" aria-label="Like video">♡</button><button class="share" aria-label="Share video">↗</button><button class="pip" aria-label="Minimize player">▣</button><button class="full" aria-label="Enter immersive fullscreen">⛶</button></div></div></div></div><aside class="side-panel product-panel"><h2>Featured products</h2><div class="product-list"></div></aside></div>`;

  class LoopPlayer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }).append(
        template.content.cloneNode(true),
      );
      this.video = this.shadowRoot.querySelector("video");
      this.sessionKey = STORE;
      this.instanceToken = `loop-${Math.random().toString(36).slice(2, 9)}`;
      this.bound = false;
    }
    connectedCallback() {
      if (this.bound) return;
      this.bound = true;
      const source = this.getAttribute("src") || "";
      if (
        /\.m3u8(?:$|\?)/i.test(source) &&
        !this.video.canPlayType("application/vnd.apple.mpegurl") &&
        globalThis.Hls?.isSupported()
      ) {
        this.hls = new globalThis.Hls();
        this.hls.loadSource(source);
        this.hls.attachMedia(this.video);
      } else this.video.src = source;
      this.video.poster = this.getAttribute("poster") || "";
      this.video.muted = this.hasAttribute("muted");
      this.video.loop = this.hasAttribute("loop");
      this.shadowRoot.querySelector(".title").textContent =
        this.getAttribute("title") || "Live shopping, in the moment";
      this.shadowRoot.querySelector(".host").textContent =
        this.getAttribute("host") || "LOOP LIVE · Discover something new";
      const mode = (this.getAttribute("mode") || "vod").toLowerCase();
      this.mode = mode;
      this.state = "idle";
      this.chatPolicy =
        this.getAttribute("chat-policy") ||
        (mode === "live" ? "fullscreen_only" : "disabled");
      this.shadowRoot.querySelector(".chat-panel").hidden =
        this.chatPolicy === "disabled";
      this.isLive = mode === "live" || mode === "prerecorded-as-live";
      this.shadowRoot.querySelector(".scrub").hidden = this.isLive;
      this.shadowRoot.querySelector(".speed").hidden =
        this.isLive || mode === "upcoming";
      this.shadowRoot.querySelector(".speed").onclick = () => this.cycleSpeed();
      this.setState("loading-metadata");
      this.products = this.readJsonAttribute("products", []);
      this.cues = this.readJsonAttribute("cues", []);
      this.renderProducts();
      const badge = this.shadowRoot.querySelector(".badge");
      if (mode === "replay" || mode === "vod") {
        badge.textContent = mode === "replay" ? "REPLAY" : "LOOP VIDEO";
        badge.classList.add("replay");
      }
      this.shadowRoot.querySelector(".play").onclick = () =>
        this.startFromGesture();
      this.shadowRoot.querySelector(".toggle").onclick = () => this.toggle();
      this.shadowRoot.querySelector(".mute").onclick = () => {
        this.video.muted = !this.video.muted;
        this.syncMute();
        this.emit("audio", { muted: this.video.muted });
      };
      this.shadowRoot.querySelector(".close").onclick = () =>
        this.hasAttribute("data-expanded")
          ? this.exitFullscreen()
          : api.close();
      this.shadowRoot.querySelector(".pip").hidden = false;
      this.shadowRoot.querySelector(".pip").onclick = () =>
        this.hasAttribute("data-floating") ? this.restore() : this.minimize();
      this.shadowRoot.querySelector(".full").onclick = () => this.fullscreen();
      const featuredTitle = this.getAttribute("product-title");
      const featuredDescription = this.getAttribute("product-description");
      const featuredAction = this.getAttribute("product-action");
      if (featuredTitle)
        this.shadowRoot.querySelector(".product-name").textContent =
          featuredTitle;
      if (featuredDescription)
        this.shadowRoot.querySelector(".price").textContent =
          featuredDescription;
      if (featuredAction)
        this.shadowRoot.querySelector(".shop").textContent = featuredAction;
      this.shadowRoot.querySelector(".shop").onclick = () =>
        this.openProductPage();
      this.shadowRoot.querySelector(".heart").onclick = (e) => {
        e.currentTarget.textContent =
          e.currentTarget.textContent === "♡" ? "♥" : "♡";
        this.emit("reaction", { reaction: "like" });
      };
      this.shadowRoot.querySelector(".share").onclick = async () => {
        try {
          await navigator.share({
            title: this.getAttribute("title") || "LOOP video",
            url: location.href,
          });
        } catch {
          await navigator.clipboard?.writeText(location.href);
        }
        this.emit("share");
      };
      this.shadowRoot.querySelector(".chat-form").onsubmit = (e) => {
        e.preventDefault();
        const input = this.shadowRoot.querySelector(".chat-form input");
        if (!input.value.trim()) return;
        const line = document.createElement("div");
        line.className = "chat-line";
        line.textContent = `You: ${input.value.trim()}`;
        this.shadowRoot.querySelector(".chat-messages").append(line);
        input.value = "";
        this.emit("chat-message");
      };
      this.shadowRoot.querySelector(".resume").onclick = () => this.play();
      this.shadowRoot.querySelector(".scrub").oninput = (e) => {
        if (Number.isFinite(this.video.duration))
          this.video.currentTime =
            (Number(e.target.value) / 1000) * this.video.duration;
      };
      this.video.addEventListener("play", () => {
        this.classList.add("is-playing");
        this.classList.remove("is-paused");
        this.setState("playing");
        this.shadowRoot.querySelector(".toggle").textContent = "Ⅱ";
        this.shadowRoot
          .querySelector(".toggle")
          .setAttribute("aria-label", "Pause");
        this.emit("play");
        this.save();
      });
      this.video.addEventListener("pause", () => {
        this.classList.add("is-paused");
        this.classList.remove("is-playing");
        this.setState("paused");
        this.shadowRoot.querySelector(".toggle").textContent = "▶";
        this.shadowRoot
          .querySelector(".toggle")
          .setAttribute("aria-label", "Play");
        this.emit("pause");
        this.save();
      });
      this.video.addEventListener("loadstart", () =>
        this.setState("loading-media"),
      );
      this.video.addEventListener("waiting", () => {
        this.setState("buffering");
        this.showStatus("Buffering…");
        this.emit("buffer-start");
      });
      this.video.addEventListener("stalled", () =>
        this.setState("reconnecting"),
      );
      this.video.addEventListener("playing", () => {
        this.setState("playing");
        this.showStatus("");
        this.emit("buffer-end");
      });
      this.video.addEventListener("timeupdate", () => {
        this.paintTime();
        this.syncTimedCue();
        this.updateLiveOffset();
      });
      this.video.addEventListener("durationchange", () => this.paintTime());
      this.video.addEventListener("volumechange", () => this.syncMute());
      this.video.addEventListener("ended", () => {
        this.setState("ended");
        this.emit("complete");
      });
      this.video.addEventListener("error", () => {
        this.setState(navigator.onLine ? "fatal-error" : "offline");
        this.showError();
      });
      this.video.addEventListener("loadedmetadata", () => {
        this.setState("ready");
        this.paintTime();
        this.emit("ready");
      });
      this.video.addEventListener("click", () => this.startFromGesture());
      this.classList.add("is-paused");
      api.register(this);
      this.controlsTimer = setTimeout(() => this.hideControls(), 2500);
      this.addEventListener("pointermove", () => this.revealControls(), {
        passive: true,
      });
      this.addEventListener("focusin", () => this.revealControls());
      this.addEventListener("pointerleave", () => {
        if (!this.video.paused) this.hideControls();
      });
      document.addEventListener(
        "fullscreenchange",
        (this.onFullscreenChange = () => {
          if (!document.fullscreenElement && this.hasAttribute("data-expanded"))
            this.exitFullscreen(false);
        }),
      );
      globalThis.addEventListener(
        "online",
        (this.onOnline = () => {
          if (this.state === "offline") this.retry();
        }),
      );
      if (!this.hasAttribute("src")) this.shadowRoot.querySelector(".error");
    }
    emit(name, detail = {}) {
      const payload = {
        version: 1,
        playerId: this.instanceToken,
        mediaId: this.getAttribute("media-id") || null,
        mode: this.mode,
        ...detail,
      };
      this.dispatchEvent(
        new CustomEvent(`loop:${name}`, {
          bubbles: true,
          composed: true,
          detail: payload,
        }),
      );
      globalThis.dispatchEvent(
        new CustomEvent(`loop:${name}`, { detail: payload }),
      );
    }
    setState(state) {
      if (this.state === state) return;
      const previous = this.state;
      this.state = state;
      this.dataset.state = state;
      this.emit("state-change", { state, previous });
    }
    showStatus(message) {
      const el = this.shadowRoot.querySelector(".status");
      el.textContent = message;
      el.hidden = !message;
    }
    hideControls() {
      if (!this.video.paused && !this.shadowRoot.activeElement)
        this.shadowRoot.querySelector(".controls").classList.add("is-hidden");
    }
    revealControls() {
      this.shadowRoot.querySelector(".controls").classList.remove("is-hidden");
      clearTimeout(this.controlsTimer);
      if (!this.video.paused)
        this.controlsTimer = setTimeout(() => this.hideControls(), 2400);
    }
    cycleSpeed() {
      const options = [1, 1.25, 1.5, 2, 0.75];
      const next =
        options[
          (options.indexOf(this.video.playbackRate) + 1) % options.length
        ];
      this.video.playbackRate = next;
      this.shadowRoot.querySelector(".speed").textContent = `${next}×`;
      this.emit("playback-speed", { rate: next });
    }
    updateLiveOffset() {
      if (!this.isLive || !this.video.seekable.length) return;
      const end = this.video.seekable.end(this.video.seekable.length - 1);
      const offset = Math.max(0, end - this.video.currentTime);
      this.liveOffset = offset;
      const indicator = this.shadowRoot.querySelector(".live-offset");
      indicator.hidden = offset <= 3;
      indicator.textContent =
        offset > 3 ? `−${Math.floor(offset)}s behind` : "";
    }
    async play() {
      try {
        await this.video.play();
        this.shadowRoot.querySelector(".resume").style.display = "none";
        return this;
      } catch (error) {
        this.shadowRoot.querySelector(".resume").style.display = "block";
        this.emit("autoplay-blocked", { reason: error.name });
        throw error;
      }
    }
    async startFromGesture() {
      this.video.muted = false;
      this.syncMute();
      this.shadowRoot.querySelector(".sound-prompt").hidden = true;
      return this.play();
    }
    pause() {
      this.video.pause();
      return this;
    }
    toggle() {
      return this.video.paused ? this.play().catch(() => {}) : this.pause();
    }
    mute() {
      this.video.muted = true;
      this.syncMute();
      return this;
    }
    unmute() {
      this.video.muted = false;
      this.syncMute();
      return this;
    }
    seek(seconds) {
      if (this.isLive) {
        this.emit("error", { code: "LIVE_SEEK_NOT_ALLOWED" });
        return this;
      }
      this.setState("seeking");
      this.video.currentTime = Math.max(0, Number(seconds) || 0);
      return this;
    }
    goLive() {
      if (this.video.seekable.length)
        this.video.currentTime = this.video.seekable.end(
          this.video.seekable.length - 1,
        );
      return this;
    }
    readJsonAttribute(name, fallback) {
      try {
        const value = JSON.parse(this.getAttribute(name) || "");
        return Array.isArray(value) ? value : fallback;
      } catch {
        return fallback;
      }
    }
    renderProducts() {
      const list = this.shadowRoot.querySelector(".product-list");
      list.replaceChildren();
      for (const item of this.products) {
        const row = document.createElement("div");
        row.className = "product-row";
        const thumb = document.createElement("div");
        thumb.className = "product-thumb";
        if (item.image) thumb.style.backgroundImage = `url("${String(item.image).replace(/["\\]/g, "")}")`;
        const info = document.createElement("div");
        info.style.flex = "1";
        const name = document.createElement("strong");
        name.textContent = item.name || "Featured product";
        const price = document.createElement("div");
        price.textContent = item.price || "";
        const pin = document.createElement("button");
        pin.type = "button";
        pin.textContent = "Pin now";
        pin.onclick = () => this.pinProduct(item.id);
        info.append(name, price);
        if (item.url) {
          try {
            const url = new URL(item.url);
            if (url.protocol === "https:") {
              const link = document.createElement("a");
              link.className = "product-link";
              link.textContent = "View product ↗";
              if (item.pipUrl) {
                const destination = new URL(item.pipUrl, document.baseURI);
                link.href = destination.href;
                link.onclick = event => { event.preventDefault(); this.openProductPage(destination.href); };
              } else {
                link.href = url.href;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
              }
              info.append(link);
            }
          } catch {}
        }
        row.append(thumb, info, pin);
        list.append(row);
      }
    }
    pinProduct(productId, durationSeconds = 5) {
      const item = this.products.find(
        (product) => String(product.id) === String(productId),
      );
      if (!item) return false;
      this.activeProduct = item;
      this.shadowRoot.querySelector(".product-name").textContent =
        item.name || "Featured pick";
      this.shadowRoot.querySelector(".price").textContent = item.price || "";
      const image = this.shadowRoot.querySelector(".swatch");
      if (item.image)
        image.style.backgroundImage = `url("${String(item.image).replace(/[\"\\]/g, "")}")`;
      const pin = this.shadowRoot.querySelector(".pin");
      pin.textContent = `Pinned · ${durationSeconds}s`;
      this.shadowRoot.querySelector(".product").hidden = false;
      clearTimeout(this.pinTimer);
      this.pinTimer = setTimeout(
        () => {
          pin.textContent = "";
          if (this.activeProduct === item)
            this.shadowRoot.querySelector(".product").hidden = true;
        },
        Math.max(1, Number(durationSeconds) || 5) * 1000,
      );
      this.emit("shopping:product-impression", {
        productId: item.id,
        cueId: null,
      });
      this.emit("shopping:product-pin", {
        productId: item.id,
        durationSeconds,
      });
      return true;
    }
    syncTimedCue() {
      if (this.mode === "live") return;
      const cue = this.cues.find(
        (entry) =>
          this.video.currentTime >= Number(entry.at || entry.time || 0) &&
          this.video.currentTime <
            Number(entry.at || entry.time || 0) + Number(entry.duration || 5),
      );
      if (cue && this.activeCueId !== cue.id) {
        this.activeCueId = cue.id;
        this.pinProduct(cue.productId, cue.duration || 5);
      }
    }
    async fullscreen() {
      this.setAttribute("data-expanded", "");
      this.classList.add("is-expanded");
      Object.assign(this.style, {
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100dvh",
        maxWidth: "none",
        aspectRatio: "auto",
        zIndex: "2147482000",
        borderRadius: "0",
      });
      try {
        await this.requestFullscreen();
        this.emit("fullscreen", { active: true });
      } catch {
        this.emit("fullscreen", { active: true, fallback: true });
      }
      return this;
    }
    async exitFullscreen(requestExit = true) {
      if (requestExit && document.fullscreenElement === this) {
        try {
          await document.exitFullscreen();
        } catch {}
      }
      this.classList.remove("is-expanded");
      this.removeAttribute("data-expanded");
      this.style.position = "";
      this.style.inset = "";
      this.style.width = "";
      this.style.height = "";
      this.style.maxWidth = "";
      this.style.aspectRatio = "";
      this.style.zIndex = "";
      this.style.borderRadius = "";
      this.emit("fullscreen", { active: false });
      return this;
    }
    async retry() {
      this.setState("reconnecting");
      this.showStatus("Reconnecting…");
      const time = this.video.currentTime || 0;
      this.video.load();
      this.video.addEventListener(
        "loadedmetadata",
        () => {
          if (!this.isLive) this.video.currentTime = time;
          this.play().catch(() => {});
        },
        { once: true },
      );
    }
    async minimize(options = {}) {
      await api.minimize(this, options);
      return this;
    }
    async openProductPage(target = null) {
      target ||= this.getAttribute("product-url") || this.activeProduct?.url;
      if (!target) return this;
      let destination;
      try {
        destination = new URL(target, document.baseURI);
      } catch {
        return this;
      }
      if (destination.origin === location.origin) {
        await this.minimize();
        location.assign(destination.href);
      } else globalThis.open(destination.href, "_blank", "noopener,noreferrer");
      return this;
    }
    restore() {
      api.restore();
      return this;
    }
    close() {
      api.close();
      return this;
    }
    destroy() {
      this.pause();
      api.unregister(this);
      this.remove();
    }
    save() {
      if (!this.getAttribute("src")) return;
      try {
        sessionStorage.setItem(
          this.sessionKey,
          JSON.stringify({
            src: this.hasAttribute("public-src")
              ? this.getAttribute("src")
              : null,
            sourceRef: this.getAttribute("source-ref") || null,
            mediaId: this.getAttribute("media-id") || null,
            title: this.getAttribute("title") || "",
            mode: this.mode,
            time: this.video.currentTime || 0,
            muted: this.video.muted,
            volume: this.video.volume,
            wantsPlay: !this.video.paused,
            floating: this.hasAttribute("data-floating"),
            at: Date.now(),
          }),
        );
      } catch {}
    }
    paintTime() {
      const d = this.video.duration || 0,
        t = this.video.currentTime || 0;
      const fmt = (n) =>
        `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
      this.shadowRoot.querySelector(".time").textContent =
        `${fmt(t)} / ${fmt(d)}`;
      this.shadowRoot.querySelector(".scrub").value = d
        ? String(Math.round((t / d) * 1000))
        : "0";
    }
    syncMute() {
      const b = this.shadowRoot.querySelector(".mute");
      b.textContent = this.video.muted ? "◖" : "◖̸";
      b.setAttribute("aria-label", this.video.muted ? "Unmute" : "Mute");
    }
    showError() {
      let e = this.shadowRoot.querySelector(".error");
      if (!e) {
        e = document.createElement("div");
        e.className = "error";
        e.setAttribute("role", "status");
        e.textContent =
          "Video could not load. Check the stream URL and try again.";
        this.shadowRoot.querySelector(".frame").append(e);
      }
      this.emit("error", { code: "MEDIA_UNAVAILABLE" });
    }
  }

  const instances = new Set();
  let floating = null;
  let channel = null;
  const api = {
    version: "0.1.0",
    players: instances,
    init(config = {}) {
      const element = config.element || document.createElement(TAG_NAME);
      for (const [key, value] of Object.entries(config))
        if (!["element", "container"].includes(key) && value != null)
          element.setAttribute(
            key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
            String(value),
          );
      if (!element.isConnected)
        (config.container instanceof HTMLElement
          ? config.container
          : document.body
        ).append(element);
      return Promise.resolve(element);
    },
    get currentPlayer() {
      return (
        [...instances].find(
          (p) => p.isConnected && p.video && !p.hasAttribute("data-floating"),
        ) ||
        [...instances].find((p) => p.isConnected) ||
        null
      );
    },
    register(p) {
      instances.add(p);
    },
    unregister(p) {
      instances.delete(p);
      if (floating === p) floating = null;
    },
    async minimize(player = api.currentPlayer, options = {}) {
      if (!player) return;
      if (player.hasAttribute("data-expanded")) await player.exitFullscreen();
      const host = document.createElement("div");
      host.className = "pip-host";
      host.setAttribute("role", "region");
      host.setAttribute("aria-label", "Floating LOOP player");
      const drag = document.createElement("div");
      drag.className = "pip-drag";
      drag.setAttribute("aria-hidden", "true");
      host.append(drag);
      Object.assign(host.style, {
        position: "fixed",
        zIndex: "2147483000",
        right: options.right || "max(16px, env(safe-area-inset-right))",
        bottom: "max(18px, env(safe-area-inset-bottom))",
        width: "min(220px, 42vw)",
        aspectRatio: "9 / 16",
        maxHeight: "42vh",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#08090a",
        boxShadow: "0 12px 48px #0008",
        touchAction: "none",
      });
      Object.assign(drag.style, {
        position: "absolute",
        left: "0",
        right: "80px",
        top: "0",
        height: "42px",
        cursor: "grab",
        zIndex: "4",
      });
      const rect = player.getBoundingClientRect();
      player._loopFloatingStyle = {};
      for (const property of [
        "display",
        "width",
        "height",
        "min-width",
        "max-width",
        "aspect-ratio",
        "border-radius",
        "position",
        "inset",
      ]) {
        player._loopFloatingStyle[property] = [
          player.style.getPropertyValue(property),
          player.style.getPropertyPriority(property),
        ];
      }
      Object.assign(player.style, {
        display: "block",
        position: "relative",
        inset: "auto",
        width: "100%",
        height: "100%",
        minWidth: "0",
        maxWidth: "none",
        aspectRatio: "auto",
        borderRadius: "inherit",
      });
      if (player.parentNode) {
        player._loopAnchor = document.createComment("loop-player-anchor");
        player.parentNode.insertBefore(player._loopAnchor, player);
      }
      player.setAttribute("data-floating", "");
      host.append(player);
      document.body.append(host);
      floating = player;
      let startX = 0,
        startY = 0,
        left = 0,
        top = 0;
      drag.onpointerdown = (e) => {
        const r = host.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        left = r.left;
        top = r.top;
        drag.setPointerCapture(e.pointerId);
      };
      drag.onpointermove = (e) => {
        if (!drag.hasPointerCapture(e.pointerId)) return;
        host.style.left = `${Math.max(8, Math.min(innerWidth - host.offsetWidth - 8, left + e.clientX - startX))}px`;
        host.style.top = `${Math.max(8, Math.min(innerHeight - host.offsetHeight - 8, top + e.clientY - startY))}px`;
        host.style.right = "auto";
        host.style.bottom = "auto";
      };
      drag.onpointerup = () => {
        const r = host.getBoundingClientRect();
        sessionStorage.setItem(
          "loop-player-position",
          JSON.stringify({ left: r.left, top: r.top }),
        );
      };
      player.save();
      player.emit("pip-enter", { presentationMode: "floating" });
      try {
        sessionStorage.setItem("loop-player-closed", "0");
      } catch {}
      try {
        await channel?.postMessage({ type: "claim", id: player.instanceToken });
      } catch {}
      if (!player.video.paused)
        player.video
          .play()
          .catch(
            () =>
              (player.shadowRoot.querySelector(".resume").style.display =
                "block"),
          );
      if (rect.width < 2) host.style.visibility = "visible";
      return player;
    },
    restore() {
      if (!floating) return;
      const player = floating,
        host = player.parentElement;
      player.removeAttribute("data-floating");
      if (player._loopAnchor?.isConnected) {
        player._loopAnchor.parentNode.insertBefore(player, player._loopAnchor);
        player._loopAnchor.remove();
        player._loopAnchor = null;
      } else if (host?.classList.contains("pip-host")) {
        host.before(player);
      }
      if (host?.classList.contains("pip-host")) host.remove();
      if (player._loopFloatingStyle) {
        for (const [property, [value, priority]] of Object.entries(
          player._loopFloatingStyle,
        )) {
          if (value) player.style.setProperty(property, value, priority);
          else player.style.removeProperty(property);
        }
        player._loopFloatingStyle = null;
      }
      floating = null;
      player.emit("pip-exit", { presentationMode: "inline" });
      return player;
    },
    close() {
      const player = floating || api.currentPlayer;
      if (player) player.pause();
      if (floating) {
        const host = floating.parentElement;
        floating.remove();
        host?.remove();
        instances.delete(floating);
        floating = null;
      }
      try {
        sessionStorage.setItem("loop-player-closed", "1");
        sessionStorage.removeItem(STORE);
      } catch {}
      globalThis.dispatchEvent(new CustomEvent("loop:close"));
    },
    play() {
      return api.currentPlayer?.play();
    },
    pause() {
      return api.currentPlayer?.pause();
    },
    mute() {
      return api.currentPlayer?.mute();
    },
    unmute() {
      return api.currentPlayer?.unmute();
    },
    seek(t) {
      return api.currentPlayer?.seek(t);
    },
    goLive() {
      return api.currentPlayer?.goLive();
    },
    fullscreen() {
      return api.currentPlayer?.fullscreen();
    },
    minimizeCurrent() {
      return api.minimize();
    },
    async nativePiP() {
      const p = api.currentPlayer;
      if (p?.video.requestPictureInPicture)
        try {
          return await p.video.requestPictureInPicture();
        } catch {}
      return null;
    },
  };
  try {
    channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("loop-player-v1")
        : null;
    channel?.addEventListener("message", (e) => {
      if (
        e.data?.type === "claim" &&
        api.currentPlayer?.instanceToken !== e.data.id
      )
        api.pause();
    });
  } catch {}
  globalThis.LOOP = api;
  if (!customElements.get(TAG_NAME))
    customElements.define(TAG_NAME, LoopPlayer);
  globalThis.dispatchEvent(
    new CustomEvent("loop:ready", { detail: { version: api.version } }),
  );
  globalThis.addEventListener("pagehide", () => {
    (floating || api.currentPlayer)?.save();
  });
  globalThis.addEventListener("pageshow", async () => {
    if (sessionStorage.getItem("loop-player-closed") === "1") return;
    let data;
    try {
      data = JSON.parse(sessionStorage.getItem(STORE) || "null");
    } catch {}
    if (
      !data?.floating ||
      (!data.src && !data.sourceRef) ||
      Date.now() - data.at > 2 * 60 * 60 * 1000
    )
      return;
    let src = data.src;
    if (!src && data.sourceRef && typeof api.resolveSource === "function") {
      try {
        const resolved = await api.resolveSource(data.sourceRef);
        src = typeof resolved === "string" ? resolved : resolved?.url;
      } catch {}
    }
    if (!src) return;
    let player = document.querySelector(TAG_NAME);
    if (!player) {
      player = document.createElement(TAG_NAME);
      player.setAttribute("src", src);
      if (data.src) player.setAttribute("public-src", "");
      if (data.sourceRef) player.setAttribute("source-ref", data.sourceRef);
      if (data.mediaId) player.setAttribute("media-id", data.mediaId);
      player.setAttribute("title", data.title);
      player.setAttribute("mode", data.mode);
      document.body.append(player);
    }
    const restore = async () => {
      const video = player.video;
      const savedTime = Number(data.time) || 0;
      const seekToSavedTime = async () => {
        if (savedTime <= 0 || !Number.isFinite(savedTime)) return;
        const duration = video.duration;
        const target = Number.isFinite(duration) && duration > 0
          ? Math.min(savedTime, Math.max(0, duration - 0.1))
          : savedTime;
        if (Math.abs(video.currentTime - target) < 0.75) return;
        const seeked = new Promise((resolve) => {
          const timeout = setTimeout(resolve, 1500);
          video.addEventListener(
            "seeked",
            () => {
              clearTimeout(timeout);
              resolve();
            },
            { once: true },
          );
        });
        try {
          video.currentTime = target;
          await seeked;
        } catch {}
      };
      await seekToSavedTime();
      video.volume = Math.max(0, Math.min(1, Number(data.volume ?? 1)));
      video.muted = Boolean(data.muted);
      player.syncMute();
      await api.minimize(player);
      if (video.readyState < 2) {
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 1500);
          video.addEventListener(
            "canplay",
            () => {
              clearTimeout(timeout);
              resolve();
            },
            { once: true },
          );
        });
      }
      if (data.wantsPlay) await player.play().catch(() => {});
      await seekToSavedTime();
      player.save();
    };
    if (player.video.readyState >= 1) restore();
    else
      player.video.addEventListener("loadedmetadata", restore, { once: true });
  });
})();
