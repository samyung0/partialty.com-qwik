import { $ } from '@builder.io/qwik';
import { PROD_FILES_URL } from '~/const';
import downloadGithubFetchCloudflareServer from '~/utils/downloadGithubFetchCloudflareServer';
import { isBinary } from '~/utils/fileUtil';

export default $(
  async (
    owner: string,
    repo: string,
    branch: string = 'main'
  ): Promise<[false, string] | [true, { success: FetchedFile[]; failed: { key: string; reason: string }[] }]> => {
    try {
      const folder = `${owner}-${repo}-${branch}/`;
      const baseURL = PROD_FILES_URL;

      const res = await downloadGithubFetchCloudflareServer(owner, repo, branch);
      if (!res[0]) return res;

      const files = res[1];
      console.log(files);

      const ret: FetchedFile[] = files.map((entry) => {
        return {
          path: entry.Key?.slice(folder.length) ?? '',
          data: '',
          resolved: false,
          isBinary: false,
          size: entry.Size ?? 0,
        };
      });

      const cacheStorage = await caches.open('GithubDownload');
      const cacheMatchesPromises = files.map((entry) =>
        cacheStorage.match(new Request(folder + entry.ETag!.slice(1, -1)))
      );
      const cacheMatches = await Promise.all(cacheMatchesPromises);
      const fetchPromise = [];
      const mapToFetch: Record<string, number> = {};
      for (let i = 0; i < cacheMatches.length; i++) {
        const cache = cacheMatches[i];
        ret[i].size = files[i].Size ?? 0;
        ret[i].isBinary = isBinary(files[i].Key?.split('/').pop() ?? '');
        if (cache === undefined) {
          mapToFetch[fetchPromise.length] = i;
          fetchPromise.push(
            fetch(`${baseURL}/${files[i].Key!}`, {
              headers: {
                // Range: "0-",
                // "Content-Range": "bytes 0-/*"
              },
            })
          );
        } else {
          console.log('CACHE HIT');
          try {
            // const json = await cache.json();
            ret[i].data = ret[i].isBinary ? await cache.arrayBuffer() : await cache.text();
            ret[i].resolved = true;
          } catch (e: any) {
            return [false, e.toString()];
          }
        }
      }

      console.log('To Fetch:', fetchPromise);

      const fetched = await Promise.allSettled(fetchPromise);
      const failed: { key: string; reason: string }[] = [];
      for (let i = 0; i < fetched.length; i++) {
        if (fetched[i].status === 'fulfilled') {
          const data = ret[i].isBinary
            ? await (fetched[i] as unknown as PromiseFulfilledResult<Response>).value.arrayBuffer()
            : await (fetched[i] as unknown as PromiseFulfilledResult<Response>).value.text();
          ret[i].data = data;
          ret[i].resolved = true;

          cacheStorage.put(new Request(folder + files[mapToFetch[i]].ETag!.slice(1, -1)), new Response(data));
        } else
          failed.push({
            key: files[mapToFetch[i]].Key ?? '',
            reason: (fetched[i] as unknown as PromiseRejectedResult).reason,
          });
      }

      // can rmeove resolved in this case
      // since resolved will be false for those which fetch failed

      return [true, { success: ret, failed }];
    } catch (e) {
      return [false, (e as any).toString()];
    }
  }
);

export type FetchedFile =
  | {
      path: string;
      data: string;
      resolved: boolean;
      isBinary: false;
      size: number; // in bytes
    }
  | {
      path: string;
      data: ArrayBuffer;
      resolved: boolean;
      isBinary: true;
      size: number;
    };
