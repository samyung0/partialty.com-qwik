/** @jsxImportSource react */
import { withCn } from '@udecode/cn';

import { Toolbar } from './toolbar';

export const FixedToolbar = withCn(
  Toolbar,
  'supports-backdrop-blur:bg-background relative z-50 w-full justify-between overflow-x-auto rounded-t-lg border-b border-b-border bg-background'
);
