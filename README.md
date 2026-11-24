# LOOP Platform POC

LOOP storefront and player demo. The player serves its replay from the Mumbai S3 bucket through CloudFront. The Next.js control API can start or stop a Fargate FFmpeg worker that streams the prerecorded loop into the Mumbai Amazon IVS channel. The worker streams from AWS, so the local Zscaler network is not in the RTMPS path.

## Run locally

```sh
npm run dev:web
```

Copy `.env.local.example` to `.env.local`. Local Next.js development uses the AWS SDK credential chain (for example, `aws login`) and the trusted local CA path when configured; TLS verification stays enabled. Set a private `LOOP_ADMIN_TOKEN`, then open http://localhost:3000 and use Studio Admin at `/studio`.

## Hosting

Deploy `apps/web` as the Vercel project root. Its build command prepares the static player/studio files and builds the Next.js API routes. Configure the server environment variables from `.env.local.example` in Vercel; use Vercel OIDC with `AWS_ROLE_ARN`, not long-lived AWS access keys. The Fargate task installs FFmpeg into an Alpine container when it starts, reads the loop source through CloudFront, and stops after one hour as a safety limit. The ECS task execution role injects the IVS endpoint and stream key from Secrets Manager; the key is redacted from task logs and never sent to the browser.

Vercel handles the admin/status API. Amazon ECS Fargate runs FFmpeg continuously while live, with TLS verification enabled against the container's CA bundle. Amazon IVS delivers playback. Turning the switch off stops the Fargate task and returns viewers to the CloudFront replay. The deployed task definition is recorded in `infra/ecs-task-definition.json`.
