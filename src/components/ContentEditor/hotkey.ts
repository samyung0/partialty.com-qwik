import isHotkey from "is-hotkey";
import type { Editor } from "slate";
import { toggleMark } from "~/components/ContentEditor/markFn";

const onKeyDown = (editor: Editor, event: React.KeyboardEvent) => {
  event.preventDefault();
  if (isHotkey("mod+b", event)) {
    toggleMark(editor, "bold");
    return;
  }
  if (isHotkey("mod+i", event)) {
    toggleMark(editor, "italic");
    return;
  }
  if (isHotkey("mod+c", event)) {
    toggleMark(editor, "code");
    return;
  }
  if (isHotkey("mod+u", event)) {
    toggleMark(editor, "underline");
    return;
  }
  if (isHotkey("mod+s", event)) {
    toggleMark(editor, "strikethrough");
    return;
  }
};

export default onKeyDown;
