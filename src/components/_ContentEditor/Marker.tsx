/** @jsxImportSource react */
import type { Editor } from 'slate';
import type { RenderElementProps } from 'slate-react';
import { v4 } from 'uuid';
import HighlightSVG from '~/components/_ContentEditor/HighlightSVG';
import type {
  InlineMarkerBackground,
  InlineMarkerColor,
  InlineMarkerUnderline,
} from '~/components/_ContentEditor/types';

export const withMarker = (editor: Editor) => {
  const { isInline } = editor;

  editor.isInline = (element) =>
    ['markerUnderline', 'markerBackground', 'markerColor'].includes(element.type) || isInline(element);
  return editor;
};

export const MarkerUnderlineElement = ({ attributes, children, element }: RenderElementProps) => {
  const style = { backgroundColor: 'inherit', color: 'inherit' };
  const uuid = 'a' + v4();
  children = (
    <span>
      <style
        dangerouslySetInnerHTML={{
          __html: `.dark #${uuid}{
        border-color: ${(element as InlineMarkerUnderline).underlineDarkMode} !important;
      }`,
        }}
        contentEditable={false}
      ></style>
      <span
        id={uuid}
        className={`border-b-[4px]`}
        style={{ ...style, borderColor: (element as InlineMarkerUnderline).underline }}
        {...attributes}
      >
        {children}
      </span>
    </span>
  );

  return (
    <span style={style} {...attributes}>
      {children}
    </span>
  );
};

export const MarkerBackgroundElement = ({ attributes, children, element }: RenderElementProps) => {
  const style = { backgroundColor: 'inherit', color: 'inherit', whiteSpace: 'nowrap' };
  const uuid = 'a' + v4();
  children = (
    <span>
      <style
        dangerouslySetInnerHTML={{
          __html: `.dark #${uuid}{
      fill: ${(element as InlineMarkerBackground).backgroundDarkMode} !important;
    }`,
        }}
        contentEditable={false}
      ></style>
      <span style={style} className="relative whitespace-nowrap px-[4px]">
        <span
          id={uuid}
          className={`absolute left-[-4px] top-[-2px] z-0 h-[calc(100%+4px)] w-[calc(100%+8px)]`}
          style={{ ...style, fill: (element as InlineMarkerBackground).background, pointerEvents: 'none' }}
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

  return (
    <span style={style} {...attributes}>
      {children}
    </span>
  );
};

export const MarkerColorElement = ({ attributes, children, element }: RenderElementProps) => {
  const style = { backgroundColor: 'inherit', color: 'inherit' };
  const uuid = 'a' + v4();
  children = (
    <span>
      <style
        dangerouslySetInnerHTML={{
          __html: `.dark #${uuid}{
      color: ${(element as InlineMarkerColor).colorDarkMode} !important;
    }`,
        }}
        contentEditable={false}
      ></style>
      <span id={uuid} style={{ ...style, color: (element as InlineMarkerColor).color }} {...attributes}>
        {children}
      </span>
    </span>
  );

  return (
    <span style={style} {...attributes}>
      {children}
    </span>
  );
};
