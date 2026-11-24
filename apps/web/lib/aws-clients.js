import { readFileSync } from "node:fs";
import { Agent } from "node:https";
import { rootCertificates } from "node:tls";
import { ECSClient } from "@aws-sdk/client-ecs";
import { IvsClient } from "@aws-sdk/client-ivs";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

const region = process.env.AWS_REGION || "ap-south-1";
const caPath = process.env.LOOP_AWS_CA_CERT_PATH;
const requestHandler = caPath
  ? new NodeHttpHandler({ httpsAgent: new Agent({ keepAlive: true, ca: [...rootCertificates, readFileSync(caPath)] }) })
  : undefined;
let credentials;
if (process.env.VERCEL) {
  if (!process.env.AWS_ROLE_ARN) throw new Error("AWS_ROLE_ARN is required for Vercel OIDC");
  credentials = awsCredentialsProvider({ roleArn: process.env.AWS_ROLE_ARN });
}

const clients = {
  ecs: new ECSClient({ region, ...(credentials ? { credentials } : {}), ...(requestHandler ? { requestHandler } : {}) }),
  ivs: new IvsClient({ region, ...(credentials ? { credentials } : {}), ...(requestHandler ? { requestHandler } : {}) }),
};

export function awsClients() {
  return clients;
}
