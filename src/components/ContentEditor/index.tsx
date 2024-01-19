/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";

// Import React dependencies.
import { useState } from "react";
// Import the Slate editor factory.
import type { BaseEditor, Descendant } from "slate";
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import type { ReactEditor } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

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
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const App = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(createEditor()));
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  );
};

export default qwikify$(App, { eagerness: "load" });
