/** @jsxImportSource react */
import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlate } from "slate-react";
import { toggleLinkAtSelection } from "~/components/ContentEditor/Link";
import type { Align, BlockFormat, CustomElementType, List } from "~/components/ContentEditor/types";
import { LIST_TYPES, TEXT_ALIGN_TYPES } from "~/components/ContentEditor/types";

export const BlockButton = ({
  format,
  children,
}: {
  format: BlockFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={
        isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")
          ? `border-b-2 border-black`
          : ""
      }
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </button>
  );
};

export const LinkButton = ({
  format,
  children,
}: {
  format: BlockFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={
        isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")
          ? `border-b-2 border-black`
          : ""
      }
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.preventDefault();
        toggleLinkAtSelection(editor);
      }}
    >
      {children}
    </button>
  );
};

export const EmbedButton = ({
  format,
  children,
}: {
  format: BlockFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={isBlockActive(editor, format, "type") ? `border-b-2 border-black` : ""}
      // onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        // event.stopPropagation();
        // event.preventDefault();
        // ReactEditor.focus(editor);
        if (!editor.selection) return;
        editor.insertNode(
          {
            type: "embed",
            url: "",
            children: [{ text: "" }],
          },
          {
            at: editor.selection,
          }
        );
      }}
    >
      {children}
    </button>
  );
};

export const ImageButton = ({
  format,
  setShowImageChooser,
  children,
}: {
  format: BlockFormat;
  setShowImageChooser: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={isBlockActive(editor, format, "type") ? `border-b-2 border-black` : ""}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={(event) => {
        event.preventDefault();
        setShowImageChooser(true);
      }}
    >
      {children}
    </button>
  );
};

export const CodeBlockButton = ({
  format,
  children,
}: {
  format: BlockFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={isBlockActive(editor, format, "type") ? `border-b-2 border-black` : ""}
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        // ReactEditor.focus(editor);
        if (!editor.selection) return;
        editor.insertNode(
          {
            type: "embed",
            url: "",
            children: [{ text: "" }],
          },
          {
            at: editor.selection,
          }
        );
      }}
    >
      {children}
    </button>
  );
};

export const toggleBlock = (editor: Editor, format: BlockFormat) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : (format as Align),
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : (format as CustomElementType),
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format as List, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const isBlockActive = (
  editor: Editor,
  format: BlockFormat,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    })
  );

  return !!match;
};
