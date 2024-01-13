import type { AddComponents, Theme } from "../index";
import Highlight from "./highlight";
import TextOutline from "./outline";

export default (addComponents: AddComponents, theme: Theme) => {
  Highlight(addComponents, theme);
  TextOutline(addComponents, theme);
};
