import { createContextId } from '@builder.io/qwik';
import type theme from '~/const/theme';

export const themeContext = createContextId<{ value: (typeof theme)[number] }>('theme');
