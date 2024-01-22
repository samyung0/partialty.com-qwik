import isHotkey from "is-hotkey";
import type { Editor } from "slate";
import { toggleMark } from "~/components/ContentEditor/markFn";

import { HistoryEditor } from "slate-history";

const onKeyDown = (editor: Editor, event: React.KeyboardEvent) => {
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
};

export default onKeyDown;
