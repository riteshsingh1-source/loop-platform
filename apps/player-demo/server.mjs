import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { Agent } from "node:https";
import { rootCertificates } from "node:tls";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const videoPath = resolve(root, "apps/player-demo/media/loop-live-source.mp4");
const require = createRequire(import.meta.url);

function loadLocalEnv() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}
loadLocalEnv();
const ffmpeg = process.env.FFMPEG_PATH || require("@ffmpeg-installer/ffmpeg").path;
const region = process.env.AWS_REGION || "ap-south-1";
const secretId = process.env.LOOP_IVS_SECRET_ID || "loop-demo/ivs-stream-config";
const vodPlaybackUrl = "https://d22zjoamwa62fa.cloudfront.net/media/loop-live-source.mp4";
const caPath = process.env.LOOP_AWS_CA_CERT_PATH;
const httpsAgent = caPath
  ? new Agent({ keepAlive: true, ca: [...rootCertificates, readFileSync(caPath)] })
  : undefined;
const secrets = new SecretsManagerClient({
  region,
  requestHandler: new NodeHttpHandler(httpsAgent ? { httpsAgent } : {}),
});

let broadcaster;
let liveState = "replay";
let startTimer;
let lastError = "";
let ffmpegOutput = "";

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers });
  res.end(JSON.stringify(body));
}

function statusPayload() {
  return {
    state: liveState,
    live: liveState === "live",
    vodPlaybackUrl,
    ivsPlaybackUrl: "https://8e37a21bdd5c.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.970974808424.channel.wsQirbowY6nq.m3u8",
    error: lastError || undefined,
  };
}

async function readBody(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 2048) throw new Error("Request body too large");
  }
  return JSON.parse(data || "{}");
}

async function startBroadcast() {
  if (broadcaster && broadcaster.exitCode === null) return;
  if (!existsSync(videoPath)) throw new Error(`Source video is missing: ${videoPath}`);
  if (!existsSync(ffmpeg)) throw new Error(`FFmpeg is missing at ${ffmpeg}`);
  const result = await secrets.send(new GetSecretValueCommand({ SecretId: secretId }));
  const config = JSON.parse(result.SecretString || "{}");
  if (!config.ingestEndpoint || !config.streamKey) throw new Error("IVS ingest secret is incomplete");
  const key = config.streamKey;
  const ingestUrl = `rtmps://${config.ingestEndpoint}/app/${key}`;
  lastError = "";
  ffmpegOutput = "";
  liveState = "starting";
  const tlsArgs = ["-tls_verify", "1"];
  if (caPath) tlsArgs.push("-ca_file", caPath);
  const child = spawn(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-nostdin", "-stream_loop", "-1", "-re",
    "-i", videoPath, "-c:v", "libx264", "-preset", "veryfast", "-tune", "zerolatency",
    "-pix_fmt", "yuv420p", "-r", "30", "-g", "60", "-b:v", "2200k", "-maxrate", "2200k",
    "-bufsize", "4400k", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", ...tlsArgs, "-f", "flv", ingestUrl,
  ], { stdio: ["ignore", "ignore", "pipe"] });
  broadcaster = child;
  child.stderr.on("data", (chunk) => {
    const message = chunk.toString().replaceAll(key, "[redacted]").trim();
    if (message) {
      ffmpegOutput = `${ffmpegOutput}\n${message}`.slice(-2000);
      console.error(`[ffmpeg] ${message}`);
    }
  });
  child.once("error", (error) => {
    lastError = error.message;
    liveState = "error";
  });
  child.once("close", (code) => {
    clearTimeout(startTimer);
    if (broadcaster === child) broadcaster = undefined;
    if (liveState !== "stopping") {
      liveState = code === 0 ? "replay" : "error";
      if (code !== 0) {
        lastError = /Cannot read RTMP handshake response|RTMPS.*handshake|IO Error: -9806/i.test(ffmpegOutput)
          ? "IVS RTMPS handshake failed. This network may be inspecting or blocking the stream; allow direct outbound TCP 443 to *.global-contribute.live-video.net or try an uninspected network."
          : `FFmpeg exited with code ${code}`;
      }
    } else {
      liveState = "replay";
      lastError = "";
    }
  });
  startTimer = setTimeout(() => {
    if (broadcaster === child && child.exitCode === null) liveState = "live";
  }, 12000);
}

function stopBroadcast() {
  clearTimeout(startTimer);
  if (!broadcaster || broadcaster.exitCode !== null) {
    broadcaster = undefined;
    liveState = "replay";
    return;
  }
  liveState = "stopping";
  broadcaster.kill("SIGTERM");
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  if (req.method === "GET" && url.pathname === "/api/status") return send(res, 200, statusPayload());

  if (req.method === "POST" && url.pathname === "/api/admin/live") {
    if (!process.env.LOOP_ADMIN_TOKEN) return send(res, 503, { error: "LOOP_ADMIN_TOKEN is not configured" });
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (token !== process.env.LOOP_ADMIN_TOKEN) return send(res, 401, { error: "Admin token is invalid" });
    try {
      const { live } = await readBody(req);
      if (live === true) {
        await startBroadcast();
        return send(res, 202, statusPayload());
      }
      if (live === false) {
        stopBroadcast();
        return send(res, 200, statusPayload());
      }
      return send(res, 400, { error: "Expected { live: true|false }" });
    } catch (error) {
      liveState = "error";
      lastError = error.message;
      return send(res, 500, { error: lastError });
    }
  }

  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, { error: "Method not allowed" });
  const pathname = url.pathname === "/" ? "/apps/player-demo/index.html" : decodeURIComponent(url.pathname);
  const file = resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + sep)) return send(res, 403, { error: "Forbidden" });
  try {
    const data = readFileSync(file);
    const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".mp4": "video/mp4", ".mov": "video/quicktime", ".svg": "image/svg+xml" };
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

const port = Number(process.env.PORT || 4173);
server.listen(port, "127.0.0.1", () => console.log(`LOOP connected demo: http://127.0.0.1:${port}`));
process.on("SIGINT", () => { stopBroadcast(); server.close(() => process.exit(0)); });
process.on("SIGTERM", () => { stopBroadcast(); server.close(() => process.exit(0)); });
