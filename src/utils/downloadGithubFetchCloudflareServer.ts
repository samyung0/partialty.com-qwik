import type { ListObjectsOutput } from "@aws-sdk/client-s3";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { server$ } from "@builder.io/qwik-city";
import { r2Client } from "~/utils/r2Client";

export default server$(
  async (
    owner: string,
    repo: string,
    branch: string = "main"
  ): Promise<[true, Exclude<ListObjectsOutput["Contents"], undefined>] | [false, string]> => {
    const bucket = process.env["R2_FETCHGITHUB_BUCKET"];

    const prefix = `${owner}-${repo}-${branch}/`;
    try {
      const res = await r2Client.send(
        new ListObjectsCommand({
          Bucket: bucket,
          Prefix: prefix,
        })
      );
      if (res.$metadata.httpStatusCode !== 200) return [false, "Cannot retrive contents!"];
      if (!res.Contents) return [false, "Cannot retrive contents!"];
      return [true, res.Contents];
    } catch (e: any) {
      return [false, e.toString()];
    }
  }
);
