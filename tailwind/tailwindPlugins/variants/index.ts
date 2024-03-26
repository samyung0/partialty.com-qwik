import type { AddVariant, Theme } from '../index';
import Test from './test';

export default (addVariant: AddVariant, _theme: Theme) => {
  Test(addVariant, _theme);
};
