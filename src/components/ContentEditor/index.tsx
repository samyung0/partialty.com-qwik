/** @jsxImportSource react */
import type { QRL } from "@builder.io/qwik";
import { qwikify$ } from "@builder.io/qwik-react";

import type { ListsSchema } from "@prezly/slate-lists";
import { ListType, withLists } from "@prezly/slate-lists";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HighlighterCore } from "shikiji/core";
import type { BaseEditor, BaseRange, Node } from "slate";
import { Editor, Element as SlateElement, Transforms, createEditor } from "slate";
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
import Preview from "~/components/ContentEditor/Preview";
import SaveContent from "~/components/ContentEditor/SaveContent";
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
import Prose from "~/components/Prose/react-prose";
import SyncAudio from "~/components/Prose/react-syncAudio";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import type { LuciaSession } from "~/types/LuciaSession";
import type Mux from "~/types/Mux";
import { getContentEditorHighlighter } from "~/utils/shikiji/OneDarkPro";

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

// const initialValue: Descendant[] = [
//   {
//     type: "paragraph",
//     children: [
//       {
//         text: "",
//       },
//       {
//         type: "link",
//         url: "https://google.com",
//         children: [{ text: "a" }],
//       },
//       { text: "" },
//     ],
//   },
//   {
//     type: "paragraph",
//     children: [
//       { text: "This is editable " },
//       { text: "rich", bold: true },
//       { text: " text, " },
//       { text: "much", italic: true },
//       { text: " better than a " },
//       { text: "<textarea>", code: true },
//       { text: "!" },
//     ],
//   },
//   {
//     type: "paragraph",
//     children: [
//       {
//         text: "Since it's rich text, you can do things like turn a selection of text ",
//       },
//       { text: "bold", bold: true },
//       {
//         text: ", or add a semantically rendered block quote in the middle of the page, like this:",
//       },
//     ],
//   },
//   {
//     type: "block-quote",
//     children: [{ text: "A wise quote." }],
//   },
//   {
//     type: "paragraph",
//     align: "center",
//     children: [{ text: "Try it out for yourself!" }],
//   },
// ];

const ContentEditorReact = ({
  isPreviewing,
  setIsPreviewing,
  timeStamp,
  initialUserAssets,
  user,
  contentWS,
  initialValue,
  renderedHTML,
  isEditing,
  chapterId,
  hasChanged,
  setHasChanged,
  saveChanges,
  audioAssetId,
  fetchAudio,
  chapterName,
}: {
  isPreviewing: boolean;
  setIsPreviewing: (t: boolean) => any;
  timeStamp: string;
  initialUserAssets: {
    cloudinaryImages: CloudinaryPublicPic[];
    muxAudiosWithNames: [Mux["data"][0], string][];
  };
  user: LuciaSession["user"];
  contentWS: WebSocket;
  initialValue: any;
  renderedHTML: string | undefined;
  isEditing: boolean;
  chapterId: string;
  hasChanged: boolean;
  setHasChanged: () => void;
  saveChanges: (
    contentEditorValue: string,
    renderedHTML: string,
    audio_track_playback_id: string | undefined,
    audio_track_asset_id: string | undefined
  ) => Promise<string>;
  audioAssetId: string | undefined;
  fetchAudio: QRL<
    (id: string) => Promise<{
      data: Mux["data"][0];
      filename: string;
    }>
  >;
  chapterName: string;
}) => {
  const normalizedInitialValue = initialValue ?? [
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
      type: "paragraph",
      align: "center",
      children: [{ text: "Try it out for yourself!" }],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "",
        },
      ],
    },
  ];
  // ?? [
  //   {
  //     type: "paragraph",
  //     children: [
  //       {
  //         text: "",
  //       },
  //     ],
  //   },
  // ];

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

  const [audioTrack, _setAudioTrack] = useState<{
    id: string;
    duration: number;
    filename: string;
    playback_ids: { id: string }[];
  }>();
  const setAudioTrack = (
    props:
      | {
          id: string;
          duration: number;
          filename: string;
          playback_ids: { id: string }[];
        }
      | undefined
  ) => {
    console.log("Setting audio track");
    _setAudioTrack(props);
    setHasChanged();
  };
  const audioTimeStamp = useRef(0);

  useEffect(() => {
    console.log("Chapter ID:", chapterId);

    // leave an empty paragraph at bottom (auto added)
    if (!editor.selection || editor.children.length === 0) return;
    while (editor.children.length > 1) {
      Transforms.removeNodes(editor, { at: Editor.start(editor, []) });
    }

    Transforms.insertNodes(editor, normalizedInitialValue[0], { at: Editor.start(editor, []) });
    for (let i = 1; i < normalizedInitialValue.length; i++) {
      const beforeEnd = Editor.before(editor, Editor.end(editor, []), { unit: "block" });
      Transforms.insertNodes(editor, normalizedInitialValue[i], { at: beforeEnd });
    }

    // Transforms.removeNodes(editor, { at: Editor.start(editor, []) });
    Transforms.removeNodes(editor, { at: Editor.end(editor, []) });
  }, [chapterId]);

  const parentRef = useRef<any>();
  const [shikiji, setShikiji] = useState<HighlighterCore | undefined>();

  useEffect(() => {
    (async () => setShikiji(await getContentEditorHighlighter()))();
  }, []);

  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    if (audioAssetId) {
      setIsLoadingAudio(true);
      console.log("Loading audio: " + audioAssetId);
      (async () => {
        const res = await fetchAudio(audioAssetId);
        _setAudioTrack({
          id: res.data.id,
          duration: res.data.duration,
          filename: res.filename,
          playback_ids: res.data.playback_ids,
        });
        setIsLoadingAudio(false);
      })();
    }
  }, [audioAssetId]);

  return (
    isEditing && (
      <>
        <Preview setIsPreviewing={setIsPreviewing} isPreviewing={isPreviewing} />
        {!isPreviewing && (
          <div
            ref={parentRef}
            className="relative flex h-full w-[80vw] flex-col items-center justify-center px-10"
          >
            <Slate
              onValueChange={() => {
                setHasChanged();
              }}
              editor={editor}
              initialValue={normalizedInitialValue}
            >
              <SaveContent
                audioTrack={audioTrack}
                hasChanged={hasChanged}
                saveChanges={saveChanges}
                chapterName={chapterName}
              />
              {shikiji && <SetNodeToDecorations shikiji={shikiji} />}
              {showAudioChooser && (
                <CenterAudioChooser
                  setAudioTrack={setAudioTrack}
                  timeStamp={timeStamp}
                  contentWS={contentWS}
                  userId={user.userId}
                  setShowAudioChooser={setShowAudioChooser}
                  userAudiosWithName={userAudiosWithName.current}
                />
              )}
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
              <Toolbar audioTimeStamp={audioTimeStamp} setShowImageChooser={setShowImageChooser} />
              <HoveringImage
                parentRef={parentRef}
                setReplaceCurrentImage={setReplaceCurrentImage}
                setShowImageChooser={setShowImageChooser}
              />
              <HoveringEmbed parentRef={parentRef} />
              <HoveringLink parentRef={parentRef} />
              <HoveringCodeBlock
                parentRef={parentRef}
                setShowCodeBlockSettings={setShowCodeBlockSettings}
              />
              {/* <HoveringToolbar /> */}
              <Prose>
                <Editable
                  className="outline-none"
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
            <AudioPlayer
              isLoadingAudio={isLoadingAudio}
              audioTimeStamp={audioTimeStamp}
              setAudioTrack={setAudioTrack}
              setShowAudioChooser={setShowAudioChooser}
              audioTrack={audioTrack}
            />
          </div>
        )}
        {isPreviewing && (
          <div className="flex h-full w-[80vw] flex-col">
            <Prose children={<></>} innerHTML={renderedHTML || ""} />
            <SyncAudio audioTrack={audioTrack} />
          </div>
        )}
      </>
    )
  );
};

export default qwikify$(ContentEditorReact, { eagerness: "load" });
