import type { AddComponents, Theme } from "../index";

const component = (addComponents: AddComponents, _theme: Theme) => {
  addComponents({
    ".text-outline": {
      "-webkit-text-fill-color": "transparent",
      "-webkit-text-stroke-width": "2px",
    },
  });
};

export default component;
