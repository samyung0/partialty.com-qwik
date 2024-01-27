/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";

import type { ListsSchema } from "@prezly/slate-lists";
import { ListType, withLists } from "@prezly/slate-lists";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BaseEditor, BaseRange, Descendant, Node } from "slate";
import { Element as SlateElement, createEditor } from "slate";
import type { HistoryEditor } from "slate-history";
import { withHistory } from "slate-history";
import type { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";
import AudioPlayer, { CenterAudioChooser } from "~/components/ContentEditor/AudioPlayer";

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
  useDecorate,
} from "~/components/ContentEditor/codeBlock";
import onKeyDown from "~/components/ContentEditor/hotkey";
import { withTrailingNewLine } from "~/components/ContentEditor/trailingNewLine";
import type { CustomElement, CustomText } from "~/components/ContentEditor/types";
import Prose from "~/components/Prose";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import type { LuciaSession } from "~/types/LuciaSession";
import type Mux from "~/types/Mux";

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
const schema: ListsSchema = {
  isConvertibleToListTextNode(node: Node) {
    return SlateElement.isElementType(node, "paragraph");
  },
  isDefaultTextNode(node: Node) {
    return SlateElement.isElementType(node, "paragraph");
  },
  isListNode(node: Node, type?: ListType) {
    if (type === ListType.ORDERED) {
      return SlateElement.isElementType(node, "numbered-list");
    }
    if (type === ListType.UNORDERED) {
      return SlateElement.isElementType(node, "bulleted-list");
    }
    return (
      SlateElement.isElementType(node, "numbered-list") ||
      SlateElement.isElementType(node, "bulleted-list")
    );
  },
  isListItemNode(node: Node) {
    return SlateElement.isElementType(node, "list-item");
  },
  isListItemTextNode(node: Node) {
    return SlateElement.isElementType(node, "list-item-text");
  },
  createDefaultTextNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: "paragraph" };
  },
  createListNode(type: ListType = ListType.UNORDERED, props = {}) {
    const nodeType = type === ListType.ORDERED ? "numbered-list" : "bulleted-list";
    return { children: [{ text: "" }], ...props, type: nodeType };
  },
  createListItemNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: "list-item" };
  },
  createListItemTextNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: "list-item-text" };
  },
};

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
  initialUserAssets: {
    cloudinaryImages: CloudinaryPublicPic[];
    muxAudiosWithNames: [Mux["data"][0], string][];
  };
  user: LuciaSession["user"];
}) => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() =>
    withLists(schema)(
      withTrailingNewLine(withImages(withLink(withEmbeds(withReact(withHistory(createEditor()))))))
    )
  );

  const userImages = useRef<[Promise<string>, CloudinaryPublicPic][]>([]);
  const userAudiosWithName = useRef<[Mux["data"][0], string][]>([]);

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
    userAudiosWithName.current = initialUserAssets.muxAudiosWithNames;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const decorate = useDecorate(editor);

  const [showImageChooser, setShowImageChooser] = useState(false);
  const [showAudioChooser, setShowAudioChooser] = useState(false);
  const [replaceCurrentImage, setReplaceCurrentImage] = useState(false);
  const [showCodeBlockSettings, setShowCodeBlockSettings] = useState(false);

  return (
    <div className="relative flex h-full w-[80vw] flex-col items-center justify-center px-10">
      <Slate editor={editor} initialValue={initialValue}>
        <SetNodeToDecorations />
        <CenterAudioChooser
          userId={user.userId}
          setShowAudioChooser={setShowAudioChooser}
          userAudiosWithName={userAudiosWithName.current}
        />
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
            className="text-lg outline-none"
            placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            decorate={decorate}
            onKeyDown={(event: React.KeyboardEvent) => onKeyDown(editor, event)}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Prose>
      </Slate>

      <AudioPlayer />
    </div>
  );
};

export default qwikify$(ContentEditorReact, { eagerness: "load" });
