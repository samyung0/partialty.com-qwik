/* eslint-disable qwik/jsx-img */
/** @jsxImportSource react */
import type { RenderLeafProps } from "slate-react";
import HighlightSVG from "~/components/_ContentEditor/HighlightSVG";
export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const { text, ...rest } = leaf;
  const style = { backgroundColor: "inherit", color: "inherit" };
  if (leaf.bold) {
    children = <strong style={style}>{children}</strong>;
  }

  if (leaf.code) {
    children = <code style={style}>{children}</code>;
  }

  if (leaf.italic) {
    children = <em style={style}>{children}</em>;
  }

  if (leaf.underline) {
    children = (
      <span className={`border-b-[6px]`} style={{ ...style, borderColor: leaf.underline }}>
        {children}
      </span>
    );
  }

  if (leaf.strikethrough) {
    children = <del style={style}>{children}</del>;
  }

  if (leaf.superscript) {
    children = <sup style={style}>{children}</sup>;
  }

  if (leaf.subscript) {
    children = <sub style={style}>{children}</sub>;
  }

  if (leaf.background) {
    children = (
      <span style={style} className="relative px-[4px]">
        <span
          className={`absolute left-[-4px] top-[-2px] z-0 h-[calc(100%+4px)] w-[calc(100%+8px)]`}
          style={{ ...style, fill: leaf.background, pointerEvents: "none" }}
        >
          <HighlightSVG />
        </span>
        <span style={style} className="relative z-10">
          {children}
        </span>
      </span>
    );
  }

  if (leaf.color) {
    children = <span style={{ ...style, color: leaf.color }}>{children}</span>;
  }

  if (leaf.fontSize) {
    children = <span style={{ ...style, fontSize: `${leaf.fontSize}px` }}>{children}</span>;
  }

  if (leaf.fontFamily) {
    children = <span style={{ ...style, fontFamily: `${leaf.fontFamily}` }}>{children}</span>;
  }

  if (leaf.fontSpacing) {
    children = <span style={{ ...style, letterSpacing: `${leaf.fontSpacing}px` }}>{children}</span>;
  }

  return (
    <span
      className={`${leaf.text === "" ? "pl-[0.1px] pr-[0.1px]" : ""} ${Object.keys(rest)
        .filter((key) => key !== "underline")
        .join(" ")}`}
      {...attributes}
      style={{ ...style, ...((leaf as any).style || {}) }}
    >
      {children}
    </span>
  );
};
