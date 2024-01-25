/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BaseEditor, BaseRange, Descendant } from "slate";
import { createEditor } from "slate";
import type { HistoryEditor } from "slate-history";
import { withHistory } from "slate-history";
import type { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";

import { Element } from "~/components/ContentEditor/Element";
import { HoveringEmbed, withEmbeds } from "~/components/ContentEditor/Embed";
import { CenterImageChooser, HoveringImage, withImages } from "~/components/ContentEditor/Images";
import { Leaf } from "~/components/ContentEditor/Leaf";
import { HoveringLink, withLink } from "~/components/ContentEditor/Link";
import Toolbar from "~/components/ContentEditor/Toolbar";
import {
  CenterCodeBlockSettings,
  HoveringCodeBlock,
  SetNodeToDecorations,
  toCodeLines,
  useDecorate,
} from "~/components/ContentEditor/codeBlock";
import onKeyDown from "~/components/ContentEditor/hotkey";
import { withTrailingNewLine } from "~/components/ContentEditor/trailingNewLine";
import type { CustomElement, CustomText } from "~/components/ContentEditor/types";
import Prose from "~/components/Prose";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import type { LuciaSession } from "~/types/LuciaSession";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor &
      ReactEditor &
      HistoryEditor & {
        nodeToDecorations?: Map<CustomElement, BaseRange[]>;
      };
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
      {
        type: "link",
        url: "https://google.com",
        children: [{ text: "a" }],
      },
      { text: "" },
    ],
  },
  {
    type: "codeBlock",
    language: "tsx",
    filename: "text.tsx",
    children: toCodeLines(`/* eslint-disable qwik/jsx-img */
    /** @jsxImportSource react */
    
    // Empty lines need to contain a single empty token, denoted with { empty: true }
    const normalizeEmptyLines = (line: Token[]) => {
      if (line.length === 0) {
        line.push({
          types: ["plain"],
          empty: true,
        });
      } else if (line.length === 1 && line[0].content === "") {
        line[0].empty = true;
      }
    };`),
  },
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

const ContentEditorReact = ({
  initialUserAssets,
  user,
}: {
  initialUserAssets: { cloudinaryImages: CloudinaryPublicPic[] };
  user: LuciaSession["user"];
}) => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() =>
    withTrailingNewLine(withImages(withLink(withEmbeds(withReact(withHistory(createEditor()))))))
  );

  const userImages = useRef<[Promise<string>, CloudinaryPublicPic][]>([]);

  useEffect(() => {
    const images: [Promise<string>, CloudinaryPublicPic][] = [];

    const sortedImages = initialUserAssets.cloudinaryImages.toSorted(function (a, b) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    for (let i = 0; i < sortedImages.length; i++) {
      images.push([
        fetch(sortedImages[i].secure_url)
          .then((res) => res.blob())
          .then((blob) => URL.createObjectURL(blob)),
        sortedImages[i],
      ]);
    }
    userImages.current = images;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const decorate = useDecorate(editor);

  const [showImageChooser, setShowImageChooser] = useState(false);
  const [replaceCurrentImage, setReplaceCurrentImage] = useState(false);
  const [showCodeBlockSettings, setShowCodeBlockSettings] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <Slate editor={editor} initialValue={initialValue}>
        <SetNodeToDecorations />
        {showImageChooser && (
          <CenterImageChooser
            replaceCurrentImage={replaceCurrentImage}
            setReplaceCurrentImage={setReplaceCurrentImage}
            setShowImageChooser={setShowImageChooser}
            userId={user.userId}
            userImages={userImages.current}
            editor={editor}
          />
        )}
        {showCodeBlockSettings && (
          <CenterCodeBlockSettings
            setShowCodeBlockSettings={setShowCodeBlockSettings}
            editor={editor}
          />
        )}
        <Toolbar setShowImageChooser={setShowImageChooser} />
        <HoveringImage
          setReplaceCurrentImage={setReplaceCurrentImage}
          setShowImageChooser={setShowImageChooser}
        />
        <HoveringEmbed />
        <HoveringLink />
        <HoveringCodeBlock setShowCodeBlockSettings={setShowCodeBlockSettings} />
        {/* <HoveringToolbar /> */}
        <Prose>
          <Editable
            className="border-2 border-black p-2 text-lg outline-none"
            placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            // onDOMBeforeInput={(event: InputEvent) => {
            //   console.log("wtf")
            //   switch (event.inputType) {
            //     case "formatBold":
            //       event.preventDefault();
            //       return toggleMark(editor, "bold");
            //     case "formatItalic":
            //       event.preventDefault();
            //       return toggleMark(editor, "italic");
            //     case "formatUnderline":
            //       event.preventDefault();
            //       return toggleMark(editor, "underline");
            //   }
            // }
            decorate={decorate}
            onKeyDown={(event: React.KeyboardEvent) => onKeyDown(editor, event)}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Prose>
      </Slate>
      <button
        className="mt-10"
        onClick={() => {
          console.log(editor.children);
        }}
      >
        Serialize
      </button>
    </div>
  );
};

export default qwikify$(ContentEditorReact, { eagerness: "load" });
