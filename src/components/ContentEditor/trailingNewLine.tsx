/** @jsxImportSource react */
import { Editor, Element as SlateElement, Text } from "slate";
export const withTrailingNewLine = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      const endElement = editor.above({
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "paragraph" &&
          n.children.length === 1 &&
          Text.isText(n.children[0]) &&
          n.children[0].text === "",
        at: Editor.end(editor, []),
      });
      if (!endElement) {
        editor.insertNode(
          { type: "paragraph", children: [{ text: "" }] },
          { at: Editor.end(editor, []) }
        );
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};
