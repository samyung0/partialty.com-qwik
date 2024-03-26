import { type Config } from 'tailwindcss';

import ExtendedTheme from './extend';

const theme = {
  theme: { ...ExtendedTheme },
} satisfies { theme: BaseType };

export default theme;
export type BaseType = NonNullable<NonNullable<Config>['theme']>;
