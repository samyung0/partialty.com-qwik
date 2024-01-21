/** @jsxImportSource react */
import { Editor } from "slate";
import { useSlate } from "slate-react";
import type { CustomMarkFormat } from "~/components/ContentEditor/types";

export const MarkButton = ({
  format,
  children,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={isMarkActive(editor, format) ? `border-b-2 border-black` : ""}
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

export const BackgroundMarkButton = ({
  format,
  children,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={isMarkActive(editor, format) ? `border-b-2 border-black` : ""}
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        toggleMark(editor, format, "tomato");
      }}
    >
      {children}
    </button>
  );
};

export const ColorMarkButton = ({
  format,
  children,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={isMarkActive(editor, format) ? `border-b-2 border-black` : ""}
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format, "white");
      }}
    >
      {children}
    </button>
  );
};

export const toggleMark = (editor: Editor, format: CustomMarkFormat, value?: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value || true);
  }
};
export const isMarkActive = (editor: Editor, format: CustomMarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? Object.prototype.hasOwnProperty.call(marks, format) : false;
};
