/** @jsxImportSource react */
import type { RenderLeafProps } from "slate-react";
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
    children = <u>{children}</u>;
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
    children = <span style={{ background: leaf.background }}>{children}</span>;
  }

  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }

  return (
    <span
      className={`${leaf.text === "" ? "pl-[0.1px] pr-[0.1px]" : ""} ${Object.keys(rest).join(
        " "
      )}`}
      {...attributes}
    >
      {children}
    </span>
  );
};
