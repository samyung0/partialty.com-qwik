/** @jsxImportSource react */
import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlate } from "slate-react";
import { v4 as uuidv4 } from "uuid";
import { toggleLinkAtSelection } from "~/components/_ContentEditor/Link";
import { toCodeLines } from "~/components/_ContentEditor/codeBlock";
import type {
  Align,
  BlockFormat,
  CustomElementType,
  List,
} from "~/components/_ContentEditor/types";
import { LIST_TYPES, TEXT_ALIGN_TYPES } from "~/components/_ContentEditor/types";

export const BlockButton = ({
  format,
  children,
  title
}: {
  format: BlockFormat;
  children: React.ReactNode;
  title?: string
}) => {
  const editor = useSlate();
  return (
    <button
      title={title}
      className={
        isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")
          ? `border-b-2 border-primary-dark-gray dark:border-light-mint `
          : "border-b-2 border-light-mint dark:border-primary-dark-gray "
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
  children
}: {
  format: BlockFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      title={"Link"}
      className={
        isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")
          ? `border-b-2 border-primary-dark-gray dark:border-light-mint `
          : "border-b-2 border-light-mint dark:border-primary-dark-gray"
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
      title={"Embed"}
      className={
        isBlockActive(editor, format, "type")
          ? `border-b-2 border-primary-dark-gray dark:border-light-mint `
          : "border-b-2 border-light-mint dark:border-primary-dark-gray "
      }
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
            mode: "highest",
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
      title={"Image"}
      className={
        isBlockActive(editor, format, "type")
          ? `border-b-2 border-primary-dark-gray dark:border-light-mint `
          : "border-b-2 border-light-mint dark:border-primary-dark-gray "
      }
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
      title={"Code Block"}
      className={
        isBlockActive(editor, format, "type")
          ? `border-b-2 border-primary-dark-gray dark:border-light-mint `
          : "border-b-2 border-light-mint dark:border-primary-dark-gray"
      }
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        // ReactEditor.focus(editor);
        if (!editor.selection) return;
        editor.insertNode(
          {
            type: "codeBlock",
            language: "tsx",
            children: toCodeLines("// default language: TSX"),
          },
          {
            at: editor.selection,
            mode: "highest",
          }
        );
      }}
    >
      {children}
    </button>
  );
};

export const QuizBlockButton = ({ children }: { children: React.ReactNode }) => {
  const editor = useSlate();
  return (
    <button
      title={"Multiple Choice Quiz"}
      className={
        isBlockActive(editor, "quizBlock", "type")
          ? `border-b-2 border-primary-dark-gray dark:border-light-mint `
          : "border-b-2 border-light-mint dark:border-primary-dark-gray "
      }
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        // ReactEditor.focus(editor);
        if (!editor.selection) return;
        const formName = "a" + uuidv4();
        editor.insertNode(
          {
            type: "quizBlock",
            formName: formName,
            ans: "1",
            quizTitle: "Quiz Title",
            children: [
              {
                type: "quizOption",
                formName: formName,
                optionValue: "1",
                children: [{ text: "Option 1" }],
              },
              {
                type: "quizOption",
                formName: formName,
                optionValue: "2",
                children: [{ text: "Option 2" }],
              },
            ],
          },
          {
            mode: "highest",
          }
        );
      }}
    >
      {children}
    </button>
  );
};

export const QuizCodeBlockButton = ({ children }: { children: React.ReactNode }) => {
  const editor = useSlate();
  return (
    <button
      title={"Quiz (Code/Fill in the Blanks)"}
      className={
        isBlockActive(editor, "quizCodeBlock", "type")
          ? `border-b-2 border-primary-dark-gray dark:border-light-mint `
          : "border-b-2 border-light-mint dark:border-primary-dark-gray "
      }
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        // ReactEditor.focus(editor);
        if (!editor.selection) return;
        const formName = "a" + uuidv4();
        editor.insertNode(
          {
            type: "quizCodeBlock",
            formName: formName,
            quizTitle: "Quiz Title",
            ans: {
              type: "matchInput",
              matchInput: {},
              ast: "",
            },
            astLang: "js",
            combinedText: "",
            displayAst: "",
            codeInput: "",
            removeTrailingSpaces: true,
            isCode: true,
            inputCount: 0,
            inputWidth: 500,
            children: [
              {
                type: "quizCodeParagraph",
                children: [{ text: "Some code..." }],
              },
            ],
          },
          {
            mode: "highest",
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
    const block = {
      type: format as List,
      children: [],
      listStyle: format === "bulleted-list" ? "disc" : "decimal",
    };
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
