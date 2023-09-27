import { S3Client } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env["R2_ACCOUNT_ID"];
const R2_FETCHGITHUB_ACCESS_KEY_ID = process.env["R2_FETCHGITHUB_ACCESS_KEY_ID"];
const R2_FETCHGITHUB_SECRET_ACCESS_KEY = process.env["R2_FETCHGITHUB_SECRET_ACCESS_KEY"];

if (!R2_ACCOUNT_ID || !R2_FETCHGITHUB_ACCESS_KEY_ID || !R2_FETCHGITHUB_SECRET_ACCESS_KEY)
  console.error("R2 ENV VARIABLE ERROR SERVER");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_FETCHGITHUB_ACCESS_KEY_ID!,
    secretAccessKey: R2_FETCHGITHUB_SECRET_ACCESS_KEY!,
  },
});
