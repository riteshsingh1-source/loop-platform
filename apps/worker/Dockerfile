FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY apps/worker/broadcast.mjs ./broadcast.mjs
COPY apps/player-demo/media/loop-live-source.mp4 /source.mp4

ENV SOURCE_VIDEO=/source.mp4
CMD ["node", "broadcast.mjs"]
