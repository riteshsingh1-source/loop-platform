import { spawn } from "node:child_process";

const { IVS_INGEST_ENDPOINT: endpoint, IVS_STREAM_KEY: key } = process.env;
if (!endpoint || !key) throw new Error("IVS ingest endpoint and stream key are required");

const ingestUrl = `rtmps://${endpoint}/app/${key}`;
const child = spawn("ffmpeg", [
  "-hide_banner", "-loglevel", "warning", "-nostdin", "-stream_loop", "-1", "-re",
  "-i", process.env.SOURCE_VIDEO || "/source.mp4",
  "-c:v", "libx264", "-preset", "veryfast", "-tune", "zerolatency", "-pix_fmt", "yuv420p",
  "-r", "30", "-g", "60", "-b:v", "2200k", "-maxrate", "2200k", "-bufsize", "4400k",
  "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-tls_verify", "1", "-f", "flv", ingestUrl,
], { stdio: ["ignore", "ignore", "pipe"] });

child.stderr.on("data", (chunk) => {
  const redacted = chunk.toString().replaceAll(key, "[redacted]").trim();
  if (redacted) console.error(redacted);
});
child.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
child.on("close", (code) => { process.exitCode = code || 0; });

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    if (child.exitCode === null) child.kill(signal);
  });
}
