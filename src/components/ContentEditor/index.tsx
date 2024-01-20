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
import { BlockButton } from "~/components/ContentEditor/blockFn";
import { Element } from "~/components/ContentEditor/Element";
import { Leaf } from "~/components/ContentEditor/Leaf";
import { MarkButton, toggleMark } from "~/components/ContentEditor/markFn";
import type { CustomElement, CustomText } from "~/components/ContentEditor/types";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Underline,
} from "lucide-react";
import { HoveringToolbar } from "~/components/ContentEditor/HoveringToolbar";

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
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="p-10">
      <Slate editor={editor} initialValue={initialValue}>
        <div className="flex flex-wrap gap-2 pb-12">
          <MarkButton format="bold" children={<Bold size={20} />} />
          <MarkButton format="italic" children={<Italic size={20} />} />
          <MarkButton format="underline" children={<Underline size={20} />} />
          <MarkButton format="code" children={<Code size={20} />} />
          <BlockButton format="paragraph" children={<Pilcrow size={20} />} />
          <BlockButton format="heading-one" children={<Heading1 size={20} />} />
          <BlockButton format="heading-two" children={<Heading2 size={20} />} />
          <BlockButton format="heading-three" children={<Heading3 size={20} />} />
          <BlockButton format="heading-four" children={<Heading4 size={20} />} />
          <BlockButton format="block-quote" children={<Quote size={18} />} />
          <BlockButton format="numbered-list" children={<ListOrdered size={20} />} />
          <BlockButton format="bulleted-list" children={<List size={20} />} />
          <BlockButton format="left" children={<AlignLeft size={20} />} />
          <BlockButton format="center" children={<AlignCenter size={20} />} />
          <BlockButton format="right" children={<AlignRight size={20} />} />
        </div>
        <HoveringToolbar />
        <Editable
          className="prose border-2 border-black p-2 text-lg outline-none"
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
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </div>
  );
};

export default qwikify$(App, { eagerness: "load" });
