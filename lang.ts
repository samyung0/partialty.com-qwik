export default {
  defaultLocale: { lang: 'en-US', currency: 'USD' },
  supportedLocales: [
    { lang: 'zh-HK', currency: 'HKD' },
    { lang: 'ja-JP', currency: 'JPY' },
    { lang: 'en-US', currency: 'USD' },
  ],
} as const;

export const displayNamesLang = {
  'zh-HK': 'Chinese (traditional)',
  'ja-JP': 'Japanese',
  'en-US': 'English',
} as const;

export const listSupportedLang = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-HK', label: 'Chinese (traditional)' },
  { value: 'zh-CN', label: 'Chinese (simplified)' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'fr-FR', label: 'French' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'pt-PT', label: 'Portuguese' },
  { value: 'ru-RU', label: 'Russian' },
];
