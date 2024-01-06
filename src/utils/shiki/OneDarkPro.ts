import * as shiki from "shiki";
const highlighter = await shiki.getHighlighter({
  theme: "one-dark-pro",
});
export default highlighter;
