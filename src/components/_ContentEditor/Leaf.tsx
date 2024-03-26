/* eslint-disable qwik/jsx-img */
/** @jsxImportSource react */
import type { RenderLeafProps } from 'slate-react';
import { v4 } from 'uuid';
import HighlightSVG from '~/components/_ContentEditor/HighlightSVG';
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
      <code style={style} {...attributes}>
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

  if (leaf.underline) {
    const uuid = 'a' + v4();
    children = (
      <span>
        <style
          dangerouslySetInnerHTML={{
            __html: `.dark #${uuid}{
        border-color: ${leaf.underlineDarkMode} !important;
      }`,
          }}
          contentEditable={false}
        ></style>
        <span
          id={uuid}
          className={`border-b-[4px] lg:border-b-[6px]`}
          style={{ ...style, borderColor: leaf.underline }}
          {...attributes}
        >
          {children}
        </span>
      </span>
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

  if (leaf.background) {
    const uuid = 'a' + v4();
    children = (
      <span>
        <style
          dangerouslySetInnerHTML={{
            __html: `.dark #${uuid}{
        fill: ${leaf.backgroundDarkMode} !important;
      }`,
          }}
          contentEditable={false}
        ></style>
        <span style={style} className="relative whitespace-nowrap px-[4px]">
          <span
            id={uuid}
            className={`absolute left-[-4px] top-[-2px] z-0 h-[calc(100%+4px)] w-[calc(100%+8px)]`}
            style={{ ...style, fill: leaf.background, pointerEvents: 'none' }}
            {...attributes}
          >
            <HighlightSVG />
          </span>
          <span style={style} className="relative z-10 whitespace-nowrap">
            {children}
          </span>
        </span>
      </span>
    );
  }

  if (leaf.color) {
    const uuid = 'a' + v4();
    children = (
      <span>
        <style
          dangerouslySetInnerHTML={{
            __html: `.dark #${uuid}{
        color: ${leaf.colorDarkMode} !important;
      }`,
          }}
          contentEditable={false}
        ></style>
        <span id={uuid} style={{ ...style, color: leaf.color }} {...attributes}>
          {children}
        </span>
      </span>
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
