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
import Prose from "~/components/Prose";
import { BUN_API_ENDPOINT_WS } from "~/const";
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
  initialUserAssets,
  user,
  closeWS,
  initialValue,
  renderedHTML,
  isEditing,
  chapterId,
  hasChanged,
  setHasChanged,
  saveChanges,
  audioAssetId,
  fetchAudio,
}: {
  initialUserAssets: {
    cloudinaryImages: CloudinaryPublicPic[];
    muxAudiosWithNames: [Mux["data"][0], string][];
  };
  user: LuciaSession["user"];
  closeWS: () => void;
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
      type: "block-quote",
      children: [{ text: "A wise quote." }],
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

  const [muxWS, setMuxWS] = useState<WebSocket>();
  const [audioTrack, _setAudioTrack] = useState<{
    id: string;
    duration: number;
    filename: string;
    playback_ids: { id: string }[];
  }>();
  const setAudioTrack = (props: {
    id: string;
    duration: number;
    filename: string;
    playback_ids: { id: string }[];
  }) => {
    console.log("Setting audio track");
    _setAudioTrack(props);
    setHasChanged();
  };
  const audioTimeStamp = useRef(0);
  const muxWSHeartBeat = useRef<any>();

  useEffect(() => {
    const ws = new WebSocket(BUN_API_ENDPOINT_WS + "/mux/ws");

    ws.addEventListener("open", () => {
      ws.send(
        JSON.stringify({
          type: "init",
          userId: user.userId,
        })
      );
      setMuxWS(ws);
      muxWSHeartBeat.current = setInterval(() => {
        console.log("heartbeat sent");
        ws.send(
          JSON.stringify({
            type: "heartBeat",
            userId: user.userId,
          })
        );
      }, 30 * 1000);
    });

    ws.addEventListener("error", () => {
      console.error("mux connection error!");
      setMuxWS(undefined);
      clearInterval(muxWSHeartBeat.current);
    });

    ws.addEventListener("close", () => {
      console.error("mux connection closed!");
      setMuxWS(undefined);
      clearInterval(muxWSHeartBeat.current);
    });
    window.onbeforeunload = () => {
      closeWS();
      console.log("closing mux websocket");
      ws.send(JSON.stringify({ type: "terminate", userId: user.userId }));
      ws.close();
      setMuxWS(undefined);
      clearInterval(muxWSHeartBeat.current);
      return true;
    };
    window.onunload = () => {
      closeWS();
      console.log("closing mux websocket");
      ws.send(JSON.stringify({ type: "terminate", userId: user.userId }));
      ws.close();
      setMuxWS(undefined);
      clearInterval(muxWSHeartBeat.current);
      return true;
    };
  }, []);

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
      <div
        ref={parentRef}
        className="relative flex h-full w-[80vw] flex-col items-center justify-center px-10"
      >
        {muxWS ? (
          <>
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
              />
              {shikiji && <SetNodeToDecorations shikiji={shikiji} />}
              {showAudioChooser && (
                <CenterAudioChooser
                  setAudioTrack={setAudioTrack}
                  ws={muxWS!}
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
            <AudioPlayer
              isLoadingAudio={isLoadingAudio}
              audioTimeStamp={audioTimeStamp}
              setAudioTrack={setAudioTrack}
              setShowAudioChooser={setShowAudioChooser}
              audioTrack={audioTrack}
            />
          </>
        ) : (
          <span>
            <svg
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </span>
        )}
      </div>
    )
  );
};

export default qwikify$(ContentEditorReact, { eagerness: "load" });
