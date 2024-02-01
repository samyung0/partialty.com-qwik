/* eslint-disable qwik/jsx-img */
/** @jsxImportSource react */
import type { RenderLeafProps } from "slate-react";
import HighlightSVG from "~/components/ContentEditor/HighlightSVG";
export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const { text, ...rest } = leaf;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = (
      <span className={`border-b-[6px]`} style={{ borderColor: leaf.underline }}>
        {children}
      </span>
    );
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }

  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }

  if (leaf.background) {
    children = (
      <span className="relative px-[4px]">
        <span
          className={`absolute left-[-4px] top-[-2px] z-0 h-[calc(100%+4px)] w-[calc(100%+8px)]`}
          style={{ fill: leaf.background, pointerEvents: "none" }}
        >
          <HighlightSVG />
        </span>
        <span className="relative z-10">{children}</span>
      </span>
    );
  }

  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }

  if (leaf.fontSize) {
    children = <span style={{ fontSize: `${leaf.fontSize}px` }}>{children}</span>;
  }

  if (leaf.fontFamily) {
    children = <span style={{ fontFamily: `${leaf.fontFamily}` }}>{children}</span>;
  }

  if (leaf.fontSpacing) {
    children = <span style={{ letterSpacing: `${leaf.fontSpacing}px` }}>{children}</span>;
  }

  return (
    <span
      className={`${leaf.text === "" ? "pl-[0.1px] pr-[0.1px]" : ""} ${Object.keys(rest)
        .filter((key) => key !== "underline")
        .join(" ")}`}
      {...attributes}
      style={(leaf as any).style || {}}
    >
      {children}
    </span>
  );
};
