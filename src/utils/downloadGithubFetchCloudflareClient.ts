import type { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { server$ } from "@builder.io/qwik-city";
import { r2Client } from "~/utils/r2Client";

export default server$(
  async (
    owner: string,
    repo: string,
    branch: string = "main"
  ): Promise<[true, any] | [false, string]> => {
    const errored = [false, ""];
    const bucket = process.env["R2_FETCHGITHUB_BUCKET"];

    const prefix = `${owner}-${repo}-${branch}/`;
    try {
      const res = await r2Client.send(
        new ListObjectsCommand({
          Bucket: bucket,
          Prefix: prefix,
        })
      );
      if (res.$metadata.httpStatusCode !== 200) errored[0] = true;
      if (!res.Contents) {
        errored[0] = true;
        errored[1] = "Cannot retrieve contents!";
      }

      if (errored[0]) throw new Error();

      const contentsPromise = res.Contents!.map((content) =>
        r2Client.send(
          new GetObjectCommand({
            Bucket: bucket,
            Key: content.Key,
          })
        )
      );
      const content = await Promise.allSettled(contentsPromise);

      const getFulfilled = <T>(
        p: PromiseSettledResult<T>,
        index: number
      ): { file: string; data: T } | null =>
        p.status === "fulfilled"
          ? {
              file: "/" + (res.Contents?.[index].Key?.slice(0, prefix.length) ?? ""),
              data: p.value,
            }
          : null;
      const getRejected = <T>(
        p: PromiseSettledResult<T>,
        index: number
      ): { file: string; reason: string } | null =>
        p.status === "rejected"
          ? {
              file: "/" + (res.Contents?.[index].Key?.slice(0, prefix.length) ?? ""),
              reason: p.reason,
            }
          : null;

      return [
        true,
        {
          success: content
            .map(getFulfilled)
            .filter((p): p is { file: string; data: GetObjectCommandOutput } => p !== null)
            .map(async (content) => {
              return {
                file: content.file,
                data: await (content.data.Body?.transformToString() ?? ""),
              };
            }),
          failed: content
            .map(getRejected)
            .filter((p): p is { file: string; reason: string } => p !== null),
        },
      ];
    } catch (e: any) {
      return [false, errored[1] === "" ? e.toString() : errored[1]];
    }
  }
);
