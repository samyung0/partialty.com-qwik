import isHotkey from "is-hotkey";
import type { BasePoint } from "slate";
import { Editor, Element as SlateElement, Transforms } from "slate";
import { toggleMark } from "~/components/_ContentEditor/markFn";

import { HistoryEditor } from "slate-history";
import { isBlockActive } from "~/components/_ContentEditor/blockFn";

import { onKeyDown } from "@prezly/slate-lists";

const onKeyDownFn = (editor: Editor, event: React.KeyboardEvent) => {
  // event.preventDefault();
  if (isHotkey("mod+b", event)) {
    toggleMark(editor, "bold");
    return;
  }
  if (isHotkey("mod+i", event)) {
    toggleMark(editor, "italic");
    return;
  }
  if (isHotkey("mod+u", event)) {
    toggleMark(editor, "underline");
    return;
  }
  if (isHotkey("mod+z", event)) {
    HistoryEditor.undo(editor);
    return;
  }
  if (isHotkey("mod+shift+z", event)) {
    HistoryEditor.redo(editor);
    return;
  }
  if (isHotkey("mod+a", event)) {
    const isCodeBlock = isBlockActive(editor, "codeBlock", "type");
    if (isCodeBlock) {
      if (!editor.selection) return;
      event.preventDefault();
      const test = (selection: BasePoint) => {
        const [match] = Array.from(
          Editor.nodes(editor, {
            at: { anchor: selection, focus: selection },
            match: (n) =>
              !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "codeBlock",
          })
        );
        return !!match;
      };

      const startingPoint = Editor.edges(editor, editor.selection);
      let left = startingPoint[0],
        right = startingPoint[1];
      while (test(left)) {
        const tmp = Editor.before(editor, left, { unit: "character" });
        if (!tmp) break;
        left = tmp;
      }
      while (test(right)) {
        const tmp = Editor.after(editor, right, { unit: "character" });
        if (!tmp) break;
        right = tmp;
      }
      Transforms.setSelection(editor, {
        anchor: right,
        focus: left,
      });
    }
  }

  if (isHotkey("tab", event)) {
    const isCodeBlock = isBlockActive(editor, "codeBlock", "type");
    if (isCodeBlock) {
      event.preventDefault();
      Editor.insertText(editor, "  ");
    }
  }

  if (isHotkey("shift+enter", event)) {
    const softBreak =
      isBlockActive(editor, "block-quote", "type") ||
      isBlockActive(editor, "infoBlock", "type") ||
      isBlockActive(editor, "cautionBlock", "type") ||
      isBlockActive(editor, "warningBlock", "type") ||
      isBlockActive(editor, "quizOption", "type");
    if (softBreak) {
      event.preventDefault();
      Editor.insertText(editor, "\n");
    }
  }

  if (isHotkey("mod+enter", event)) {
    if (!editor.selection) return;
    event.preventDefault();
    const after = Editor.after(editor, editor.selection, { unit: "block" });
    if (!after) return;
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
      {
        mode: "highest",
        at: [after.path[0]],
      }
    );
  }

  if (isHotkey("mod+shift+enter", event)) {
    if (!editor.selection) return;
    event.preventDefault();
    const after = Editor.before(editor, editor.selection, { unit: "block" });
    if (!after) return;
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
      {
        mode: "highest",
        at: [after.path[0]],
      }
    );
  }

  onKeyDown(editor, event);
};

export default onKeyDownFn;
