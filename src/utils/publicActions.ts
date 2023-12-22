import { $ } from "@builder.io/qwik";
import type { GlobalContextType } from "../types/GlobalContext";

export const loadPublicData = $(() => {
  // const r = new Promise<GlobalContextType["publicData"]["data"]>((res, rej) =>
  //   setTimeout(() => {
  //     res({ testData: 123 });
  //   }, 0)
  // );
  // return r;
  return {}
});
