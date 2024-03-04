import { $ } from "@builder.io/qwik";
import { graphql } from "@octokit/graphql";
import { request } from "@octokit/request";

import { MAX_NUMBER_OF_FILES_R2_FETCHGITHUB, MAX_SIZE_TO_UPLOAD_R2_FETCHGITHUB } from "~/const";
import { isBinary } from "~/utils/fileUtil";
import { uploadGithubFetchCloudflare } from "~/utils/uploadGithubFetchCloudflareServer";

export const uploadRepoToCloudflare = async (
  owner: string,
  repo: string,
  branch: string = "main"
): Promise<[boolean, string]> => {
  const GITHUB_PUBLIC_TOKEN = import.meta.env.VITE_GITHUB_PUBLIC_TOKEN;

  const data = await directFetchGithub(owner, repo, branch, GITHUB_PUBLIC_TOKEN!);
  if (!data[0]) return data;

  const size = (data[1] as FetchedFile[]).reduce((prev, curr) => prev + curr.size, 0);
  if (size > MAX_SIZE_TO_UPLOAD_R2_FETCHGITHUB) return [false, "Exceeded maximum repo size!"];

  console.log(data);

  return await uploadGithubFetchCloudflare(owner, repo, branch, data[1] as FetchedFile[]);
};

export const test = $(async function (token: string) {
  const res = await request("GET /installation/repositories", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  console.log("RES", res.data);
});

const directFetchGithub = async (
  owner: string,
  repo: string,
  branch: string = "main",
  GITHUB_PUBLIC_TOKEN: string
): Promise<[false, string] | [true, FetchedFile[]]> => {
  let errored: [boolean, string] = [false, ""];
  let apiRateLimit = false;
  try {
    const res = await request("GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1", {
      owner,
      repo,
      branch,
      headers: {
        authorization: `Bearer ${GITHUB_PUBLIC_TOKEN}`,
      },
    });
    if (res.status !== 200) errored[0] = true;
    if (res.data.message && !res.data.tree) apiRateLimit = true;

    if (errored[0] || apiRateLimit) throw new Error();

    // will not cache this response to ensure latest file can be fetched
    const files = (res.data.tree as GithubEntry[]).filter((entry) => entry.type !== "tree");
    if (files.length > MAX_NUMBER_OF_FILES_R2_FETCHGITHUB) return [false, "Too many files!"];

    const ret: FetchedFile[] = files.map((entry) => {
      return { path: entry.path, data: "", resolved: false, isBinary: false, size: 0 };
    });

    // files cooresponds to the latest commit
    // everytime there is a new commit, the sha value of the file changes
    // and invalidates the cache (more precisely since the url changed, the cache will result in a miss)
    // so we dont need to  manually delete the cache
    const cacheStorage = await caches.open("GithubUpload");
    const cacheMatchesPromises: Promise<Response | undefined>[] = files.map((entry) =>
      cacheStorage.match(new Request(entry.url))
    );

    // always resolve, no need for allSettled
    const cacheMatches = await Promise.all(cacheMatchesPromises);
    let cacheUnmatched = 0;
    let gql = `{
      repository(owner:"${owner}", name:"${repo}") {
        `;
    for (let i = 0; i < cacheMatches.length; i++) {
      const cache = cacheMatches[i];
      if (cache === undefined) {
        // cache miss, append to gql fetch list
        cacheUnmatched++;
        gql += `_${i}: object(oid: "${files[i].sha}") {
          ... on Blob {
                 isTruncated
                 byteSize
                 isBinary
                 text
               }
       }`;
      } else {
        console.log("CACHE HIT");
        // cache hit, add to return list

        // check performance
        try {
          const json = await cache.json();
          ret[i].data = json.data;
          ret[i].isBinary = json.isBinary;
          ret[i].size = json.size;
          ret[i].resolved = true;
        } catch (e: any) {
          errored = [true, e];
          throw new Error();
        }
      }
    }

    if (cacheUnmatched > 0) {
      gql += `}}`;

      const res: any = await graphql(gql, {
        headers: {
          authorization: `Bearer ${GITHUB_PUBLIC_TOKEN}`,
        },
      });

      if (!Object.prototype.hasOwnProperty.call(res, "repository")) {
        apiRateLimit = true;
        throw new Error();
      }

      const { repository } = res as { repository: Record<string, any> };

      const restAPIPromise = Array(files.length);

      for (const i in repository) {
        const index = Number(i.slice(1));
        ret[index].size = repository[i].byteSize;
        if (repository[i].isTruncated || repository[i].isBinary !== false) {
          // refetch using rest api
          restAPIPromise[index] = request("GET /repos/{owner}/{repo}/git/blobs/{oid}", {
            owner,
            repo,
            oid: files[index].sha,
            headers: {
              authorization: `Bearer ${GITHUB_PUBLIC_TOKEN}`,
            },
          });
        } else {
          ret[index].data = repository[i].text;
          ret[index].isBinary = isBinary(files[index].path);
          ret[index].resolved = true;

          cacheStorage.put(
            new Request(files[index].url),
            new Response(
              JSON.stringify({
                data: repository[i].text,
                isBinary: ret[index].isBinary,
                size: ret[index].size,
              })
            )
          );
        }
      }

      // again will always resolve
      const restAPI = await Promise.all(restAPIPromise);
      for (let i = 0; i < restAPI.length; i++) {
        if (restAPI[i] !== undefined && restAPI[i] !== null) {
          ret[i].data = restAPI[i].data.content;
          ret[i].isBinary = isBinary(files[i].path);
          ret[i].resolved = true;

          cacheStorage.put(
            new Request(files[i].url),
            new Response(
              JSON.stringify({
                data: restAPI[i].data.content,
                isBinary: ret[i].isBinary,
                size: ret[i].size,
              })
            )
          );
        }
      }
    }

    for (let i = 0; i < ret.length; i++) {
      if (!ret[i].resolved) {
        errored = [true, "Unable to load " + ret[i].path];
        throw new Error();
      }
    }

    return [true, ret];
  } catch (e: any) {
    if (apiRateLimit) {
      return [false, "Api rate limit hit!"];
    } else return [false, errored[1] === "" ? e.toString() : errored[1]];
  }
};

type GithubEntry = {
  node: string;
  path: string;
  sha: string;
  size: number;
  type: "blob" | "tree";
  url: string;
};

export type FetchedFile = {
  path: string;
  data: string; // if isBinary attribute in the response is true, then the encoding will be base64
  resolved: boolean;
  isBinary: boolean;
  size: number; // in bytes
};
