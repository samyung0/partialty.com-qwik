import type { SpeakConfig } from 'qwik-speak';
import lang from '../lang';

export const config: SpeakConfig = {
  defaultLocale: lang.defaultLocale,
  supportedLocales: [...lang.supportedLocales],
  assets: [
    'app', // Translations shared by the pages
  ],
  runtimeAssets: [
    // "runtime", // Translations with dynamic keys or parameters
  ],
};
