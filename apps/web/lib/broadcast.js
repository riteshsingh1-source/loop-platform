import {
  ListTasksCommand,
  RunTaskCommand,
  StopTaskCommand,
} from "@aws-sdk/client-ecs";
import { GetStreamCommand } from "@aws-sdk/client-ivs";
import { awsClients } from "./aws-clients.js";

const vodPlaybackUrl = process.env.LOOP_VOD_PLAYBACK_URL || "https://d22zjoamwa62fa.cloudfront.net/media/loop-live-source.mp4";
const ivsPlaybackUrl = process.env.LOOP_IVS_PLAYBACK_URL || "https://8e37a21bdd5c.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.970974808424.channel.wsQirbowY6nq.m3u8";

function config() {
  const required = ["ECS_CLUSTER_ARN", "ECS_TASK_DEFINITION_ARN", "ECS_SUBNET_IDS", "ECS_SECURITY_GROUP_ID", "LOOP_IVS_CHANNEL_ARN"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing server configuration: ${missing.join(", ")}`);
  return {
    cluster: process.env.ECS_CLUSTER_ARN,
    taskDefinition: process.env.ECS_TASK_DEFINITION_ARN,
    subnets: process.env.ECS_SUBNET_IDS.split(",").map((value) => value.trim()).filter(Boolean),
    securityGroup: process.env.ECS_SECURITY_GROUP_ID,
    channelArn: process.env.LOOP_IVS_CHANNEL_ARN,
  };
}

async function ivsIsLive(ivs, channelArn) {
  try {
    const result = await ivs.send(new GetStreamCommand({ channelArn }));
    return result.stream?.state === "LIVE";
  } catch (error) {
    if (error.name === "ChannelNotBroadcastingException" || error.name === "ResourceNotFoundException") return false;
    throw error;
  }
}

export async function getBroadcastStatus(request) {
  const { ecs, ivs } = awsClients();
  const settings = config();
  const listed = await ecs.send(new ListTasksCommand({
    cluster: settings.cluster,
    family: process.env.ECS_TASK_FAMILY || "loop-ivs-broadcaster",
    desiredStatus: "RUNNING",
  }));
  const workerRequested = Boolean(listed.taskArns?.length);
  const live = workerRequested && await ivsIsLive(ivs, settings.channelArn);
  const state = live ? "live" : workerRequested ? "starting" : "replay";
  return { state, live, vodPlaybackUrl, ivsPlaybackUrl };
}

export async function startBroadcast(request) {
  const { ecs } = awsClients();
  const settings = config();
  const existing = await ecs.send(new ListTasksCommand({
    cluster: settings.cluster,
    family: process.env.ECS_TASK_FAMILY || "loop-ivs-broadcaster",
    desiredStatus: "RUNNING",
  }));
  if (existing.taskArns?.length) return { state: "starting", live: false, vodPlaybackUrl, ivsPlaybackUrl };

  const result = await ecs.send(new RunTaskCommand({
    cluster: settings.cluster,
    taskDefinition: settings.taskDefinition,
    count: 1,
    launchType: "FARGATE",
    platformVersion: "LATEST",
    startedBy: "loop-vercel-admin",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: settings.subnets,
        securityGroups: [settings.securityGroup],
        assignPublicIp: "ENABLED",
      },
    },
  }));
  if (result.failures?.length) throw new Error(result.failures.map((failure) => failure.reason).join("; "));
  if (!result.tasks?.length) throw new Error("ECS did not start a broadcaster task");
  return { state: "starting", live: false, vodPlaybackUrl, ivsPlaybackUrl };
}

export async function stopBroadcast(request) {
  const { ecs } = awsClients();
  const settings = config();
  const listed = await ecs.send(new ListTasksCommand({
    cluster: settings.cluster,
    family: process.env.ECS_TASK_FAMILY || "loop-ivs-broadcaster",
    desiredStatus: "RUNNING",
  }));
  const tasks = listed.taskArns || [];
  await Promise.all(tasks.map((task) => ecs.send(new StopTaskCommand({
    cluster: settings.cluster,
    task,
    reason: "Stopped from LOOP Studio admin",
  }))));
  return { state: "replay", live: false, vodPlaybackUrl, ivsPlaybackUrl };
}
