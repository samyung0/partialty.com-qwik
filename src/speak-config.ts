import type { SpeakConfig } from "qwik-speak";

export const config: SpeakConfig = {
  defaultLocale: { lang: "en", currency: "USD" },
  supportedLocales: [
    { lang: "zh-HK", currency: "HKD" },
    { lang: "ja", currency: "JPY" },
    { lang: "en", currency: "USD" },
  ],
  assets: [
    "app", // Translations shared by the pages
  ],
  runtimeAssets: [
    "runtime", // Translations with dynamic keys or parameters
  ],
};
