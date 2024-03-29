/* eslint-disable qwik/jsx-img */
/** @jsxImportSource react */
import type { RenderLeafProps } from 'slate-react';
export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const { text, ...rest } = leaf;
  const style = { backgroundColor: 'inherit', color: 'inherit' };
  if (leaf.bold) {
    children = (
      <strong style={style} {...attributes}>
        {children}
      </strong>
    );
  }

  if (leaf.code) {
    children = (
      <code style={{ color: 'inherit' }} {...attributes}>
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = (
      <em style={style} {...attributes}>
        {children}
      </em>
    );
  }

  if (leaf.strikethrough) {
    children = (
      <del style={style} {...attributes}>
        {children}
      </del>
    );
  }

  if (leaf.superscript) {
    children = (
      <sup style={style} {...attributes}>
        {children}
      </sup>
    );
  }

  if (leaf.subscript) {
    children = (
      <sub style={style} {...attributes}>
        {children}
      </sub>
    );
  }

  if (leaf.fontSize) {
    children = (
      <span style={{ ...style, fontSize: `${leaf.fontSize}px` }} {...attributes}>
        {children}
      </span>
    );
  }

  if (leaf.fontFamily) {
    children = (
      <span style={{ ...style, fontFamily: `${leaf.fontFamily}` }} {...attributes}>
        {children}
      </span>
    );
  }

  if (leaf.fontSpacing) {
    children = (
      <span style={{ ...style, letterSpacing: `${leaf.fontSpacing}px` }} {...attributes}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={`${leaf.text === '' ? 'pl-[0.1px] pr-[0.1px]' : ''} ${Object.keys(rest)
        .filter((key) => key !== 'underline')
        .join(' ')}`}
      {...attributes}
      style={{ ...style, ...((leaf as any).style || {}) }}
    >
      {children}
    </span>
  );
};
