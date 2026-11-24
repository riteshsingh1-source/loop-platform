# Fargate broadcaster

The live broadcaster runs in Amazon ECS Fargate in `ap-south-1`.

- Cluster: `loop-broadcast`
- Task family: `loop-ivs-broadcaster`
- Execution role: `loop-ivs-broadcaster-execution`
- Log group: `/ecs/loop-ivs-broadcaster` (7-day retention)
- Network: default VPC public subnets, dedicated security group with no ingress and outbound HTTPS access
- Secrets: ECS injects only the `ingestEndpoint` and `streamKey` JSON fields from `loop-demo/ivs-stream-config`
- Playback input: the CloudFront MP4 URL in the task definition
- Safety: each broadcast task stops itself after one hour; the admin stop action stops it sooner
- TLS: FFmpeg keeps certificate verification enabled and uses `/etc/ssl/cert.pem`; task logs redact the stream key

`ecs-task-definition.json` records the deployed task definition. The Next.js control API starts and stops tasks in this cluster. Local development can use the AWS SDK credential chain; Vercel should use a narrowly scoped OIDC role.
