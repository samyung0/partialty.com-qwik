export default {
  defaultLocale: { lang: "en-US", currency: "USD" },
  supportedLocales: [
    { lang: "zh-HK", currency: "HKD" },
    { lang: "ja-JP", currency: "JPY" },
    { lang: "en-US", currency: "USD" },
  ],
} as const;

export const displayNamesLang = {
  "zh-HK": "Chinese (traditional)",
  "ja-JP": "Japanese",
  "en-US": "English",
} as const;
