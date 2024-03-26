import type { AddVariant, Theme } from '../index';

const variant = (addVariant: AddVariant, _theme: Theme) => {
  addVariant('theme-test', ':is(.theme-test &)');
  addVariant('theme-test2', ':is(.theme-test2 &)');
};

export default variant;
