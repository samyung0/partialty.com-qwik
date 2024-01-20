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
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

export const toggleMark = (editor: Editor, format: CustomMarkFormat) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
export const isMarkActive = (editor: Editor, format: CustomMarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
