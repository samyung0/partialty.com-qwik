import type { AddComponents, Theme } from "../index";
import Highlight from "./highlight";

export default (addComponents: AddComponents, _theme: Theme) => {
  Highlight(addComponents, _theme);
};
