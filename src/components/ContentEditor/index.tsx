/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";

// Import React dependencies.
import { useCallback, useState } from "react";
// Import the Slate editor factory.
import type { BaseEditor, Descendant } from "slate";
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import type { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";
import { Element } from "~/components/ContentEditor/Element";
import { Leaf } from "~/components/ContentEditor/Leaf";
import { toggleMark } from "~/components/ContentEditor/markFn";
import type { CustomElement, CustomText } from "~/components/ContentEditor/types";
import { withShortcuts } from "./shortcut";

import { HoveringToolbar } from "~/components/ContentEditor/HoveringToolbar";
import Toolbar from "~/components/ContentEditor/Toolbar";
import onKeyDown from "~/components/ContentEditor/hotkey";
import Prose from "~/components/Prose";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    align: "center",
    children: [{ text: "Try it out for yourself!" }],
  },
];

const App = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withShortcuts(withReact(createEditor())));

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="p-10">
      <Slate editor={editor} initialValue={initialValue}>
        <Toolbar />
        <HoveringToolbar />
        <Prose>
          <Editable
            className="border-2 border-black p-2 text-lg outline-none"
            placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            onDOMBeforeInput={(event: InputEvent) => {
              switch (event.inputType) {
                case "formatBold":
                  event.preventDefault();
                  return toggleMark(editor, "bold");
                case "formatItalic":
                  event.preventDefault();
                  return toggleMark(editor, "italic");
                case "formatUnderline":
                  event.preventDefault();
                  return toggleMark(editor, "underline");
              }
            }}
            onKeyDown={(event: React.KeyboardEvent) => onKeyDown(editor, event)}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Prose>
      </Slate>
    </div>
  );
};

export default qwikify$(App, { eagerness: "visible" });
