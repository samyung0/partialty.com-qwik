import type { SpeakConfig } from "qwik-speak";
import lang from "../lang.json";

export const config: SpeakConfig = {
  ...lang,
  assets: [
    "app", // Translations shared by the pages
  ],
  runtimeAssets: [
    "runtime", // Translations with dynamic keys or parameters
  ],
};
