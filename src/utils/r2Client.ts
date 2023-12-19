import { S3Client } from "@aws-sdk/client-s3";
import type { RequestEventBase } from "@builder.io/qwik-city";

// const R2_ACCOUNT_ID = process.env["R2_ACCOUNT_ID"];
// const R2_FETCHGITHUB_ACCESS_KEY_ID = process.env["R2_FETCHGITHUB_ACCESS_KEY_ID"];
// const R2_FETCHGITHUB_SECRET_ACCESS_KEY = process.env["R2_FETCHGITHUB_SECRET_ACCESS_KEY"];

// if (!R2_ACCOUNT_ID || !R2_FETCHGITHUB_ACCESS_KEY_ID || !R2_FETCHGITHUB_SECRET_ACCESS_KEY)
//   console.error("R2 ENV VARIABLE ERROR SERVER");

export const r2Client = ({ env }: RequestEventBase) => {
  if (
    !env.get("R2_ACCOUNT_ID") ||
    !env.get("R2_FETCHGITHUB_ACCESS_KEY_ID") ||
    !env.get("R2_FETCHGITHUB_SECRET_ACCESS_KEY")
  )
    throw new Error(
      "Missing R2_ACCOUNT_ID or R2_FETCHGITHUB_ACCESS_KEY_ID or R2_FETCHGITHUB_SECRET_ACCESS_KEY"
    );

  return new S3Client({
    region: "auto",
    endpoint: `https://${env.get("R2_ACCOUNT_ID")!}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.get("R2_FETCHGITHUB_ACCESS_KEY_ID")!,
      secretAccessKey: env.get("R2_FETCHGITHUB_SECRET_ACCESS_KEY")!,
    },
  });
};
