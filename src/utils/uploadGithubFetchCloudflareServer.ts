import {
  PutObjectCommand,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { r2Client } from "~/utils/r2Client";
import { type FetchedFile } from "~/utils/uploadGithubFetchCloudflareClient";

import { server$ } from "@builder.io/qwik-city";

import { contentType } from "~/utils/mimeTypes";

export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const uploadGithubFetchCloudflare = server$(
  async (
    owner: string,
    repo: string,
    branch: string,
    files: FetchedFile[]
  ): Promise<[boolean, string]> => {
    const url = `${owner}-${repo}-${branch}/`;
    const bucket = process.env["R2_FETCHGITHUB_BUCKET"]!;

    const error = [false, ""];
    const yakusoku: Promise<PutObjectCommandOutput>[] = Array(files.length);
    for (let i = 0; i < files.length; i++) {
      try {
        const _contentType = contentType(
          files[i].path.slice(files[i].path.lastIndexOf(".") + 1).toLowerCase()
        );
        const arg: PutObjectCommandInput = {
          Bucket: bucket,
          Key: url + files[i].path,
          Body: files[i].isBinary ? base64ToArrayBuffer(files[i].data) : files[i].data,
        };
        if (_contentType) arg.ContentType = _contentType;
        else arg.ContentType = "text/plain";

        yakusoku[i] = r2Client.send(new PutObjectCommand(arg));
      } catch (e) {
        error[0] = false;
        error[1] = "Buffer error! " + e + " at file " + JSON.stringify(files[i]);
        break;
      }
    }

    const getFulfilled = <T>(
      p: PromiseSettledResult<T>,
      index: number
    ): { index: number; value: T } | null =>
      p.status === "fulfilled" ? { index, value: p.value } : null;
    const getRejected = <T>(
      p: PromiseSettledResult<T>,
      index: number
    ): { index: number; reason: string } | null =>
      p.status === "rejected" ? { index, reason: p.reason } : null;

    // maybe need some sort of cleaning up when some files failed to upload
    const mamoru = await Promise.allSettled(yakusoku);
    const successFiles = mamoru
      .map(getFulfilled)
      .filter((p): p is { index: number; value: PutObjectCommandOutput } => p !== null);
    const failedFiles = mamoru
      .map(getRejected)
      .filter((p): p is { index: number; reason: string } => p !== null);

    return [
      true,
      failedFiles.reduce(
        (prev, curr) => prev + "Failed. " + files[curr.index].path + " " + curr.reason + "\n",
        ""
      ) +
        successFiles.reduce((prev, curr) => prev + "Success. " + files[curr.index].path + "\n", ""),
    ];
  }
);
