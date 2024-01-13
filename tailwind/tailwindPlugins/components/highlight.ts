import type { AddComponents, Theme } from "../index";

const component = (addComponents: AddComponents, theme: Theme) => {
  addComponents({
    ".highlight-yellow": {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/yellow.svg)`,
      "background-size": "100% 100%",
      margin: "-2px -6px",
      padding: "2px  6px",
    },
    ".highlight-pink": {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/pink.svg)`,
      "background-size": "100% 100%",
      margin: "-2px -6px",
      padding: "2px  6px",
    },
    ".highlight-pink-audio": {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/pink.svg)`,
      "background-size": "100% 100%",
      // margin: "-2px -6px",
      // padding: "2px  6px",
    },
    ".highlight-lilac": {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/lilac.svg)`,
      "background-size": "100% 100%",
      margin: "-2px -6px",
      padding: "2px  6px",
    },
    ".highlight-mint": {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/mint.svg)`,
      "background-size": "100% 100%",
      margin: "-2px -6px",
      padding: "2px  6px",
    },
    ".highlight-lilac-onHover": {
      position: "relative",
      overflow: "hidden",
      "&::after": {
        content: '""', // it took me 6 years to realize that I need 2 quotations to represent empty string
        display: "block",
        position: "absolute",
        top: "0",
        left: "0",
        background: `none`,
        width: "100%",
        // "stroke-dasharray": "945",
        // "stroke-dashoffset": "945",
        // transition: "stroke-dashoffset 800ms ease-in-out",
        // "will-change": "stroke-dashoffset",
        // transform: "translate3d(-100%, 0, 0)",
        height: "100%",
        "z-index": "-1",
      },
      "&:hover::after": {
        background: `url(/src/assets/svg/highlightSVG/animateLilac.svg)`,
        // "stroke-dashoffset": "0",
        // transform: "translate3d(0, 0, 0)",
        // width: "100%"
      },
    },
  });
};

export default component;
