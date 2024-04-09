/** @jsxImportSource react */
import type { QRL } from '@builder.io/qwik';
import { qwikify$ } from '@builder.io/qwik-react';

import type { ListsSchema } from '@prezly/slate-lists';
import { ListType, withLists } from '@prezly/slate-lists';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { HighlighterCore } from 'shikiji/core';
import type { BaseEditor, BaseRange, Node } from 'slate';
import { Editor, Element as SlateElement, Transforms, createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import type { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
import { Editable, Slate, withReact } from 'slate-react';
import AudioPlayer, { CenterAudioChooser } from '~/components/_ContentEditor/AudioPlayer';

import QuizCodeHydrate from '~/components/Prose/QuizCodeHydrate';
import QuizHydrate from '~/components/Prose/QuizHydrate';
import Prose from '~/components/Prose/react-prose';
import SyncAudio from '~/components/Prose/react-syncAudio';
import { Element } from '~/components/_ContentEditor/Element';
import { HoveringEmbed, withEmbeds } from '~/components/_ContentEditor/Embed';
import { CenterImageChooser, HoveringImage, withImages } from '~/components/_ContentEditor/Images';
import { Leaf } from '~/components/_ContentEditor/Leaf';
import { HoveringLink, withLink } from '~/components/_ContentEditor/Link';
import Preview from '~/components/_ContentEditor/Preview';
import SaveContent from '~/components/_ContentEditor/SaveContent';
import Toolbar from '~/components/_ContentEditor/Toolbar';
import {
  CenterCodeBlockSettings,
  HoveringCodeBlock,
  SetNodeToDecorations,
  useDecorate,
} from '~/components/_ContentEditor/codeBlock';
import onKeyDown from '~/components/_ContentEditor/hotkey';
import { CenterQuizBlockSettings, HoveringQuizBlock, withQuiz } from '~/components/_ContentEditor/quiz';
import { CenterQuizCodeBlockSettings, HoveringQuizCodeBlock, withQuizCode } from '~/components/_ContentEditor/quizCode';
import { withTrailingNewLine } from '~/components/_ContentEditor/trailingNewLine';
import type { CustomElement, CustomText } from '~/components/_ContentEditor/types';
import type theme from '~/const/theme';
import type { CloudinaryPublicPic } from '~/types/Cloudinary';
import type { LuciaSession } from '~/types/LuciaSession';
import type Mux from '~/types/Mux';
import { getContentEditorHighlighter } from '~/utils/shikiji/OneDarkPro';

import { withMarker } from '~/components/_ContentEditor/Marker';
import SmallCircleNav from '~/components/_ContentEditor/SmallCircleNav';
import './SmallCircleNav.css';
import PlateEditor from './plate';

declare module 'slate' {
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
    return SlateElement.isElementType(node, 'paragraph');
  },
  isDefaultTextNode(node: Node) {
    return SlateElement.isElementType(node, 'paragraph');
  },
  isListNode(node: Node, type?: ListType) {
    if (type === ListType.ORDERED) {
      return SlateElement.isElementType(node, 'numbered-list');
    }
    if (type === ListType.UNORDERED) {
      return SlateElement.isElementType(node, 'bulleted-list');
    }
    return SlateElement.isElementType(node, 'numbered-list') || SlateElement.isElementType(node, 'bulleted-list');
  },
  isListItemNode(node: Node) {
    return SlateElement.isElementType(node, 'list-item');
  },
  isListItemTextNode(node: Node) {
    return SlateElement.isElementType(node, 'list-item-text');
  },
  createDefaultTextNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: 'paragraph' };
  },
  createListNode(type: ListType = ListType.UNORDERED, props = {}) {
    const nodeType = type === ListType.ORDERED ? 'numbered-list' : 'bulleted-list';
    return { children: [{ text: '' }], ...props, type: nodeType };
  },
  createListItemNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: 'list-item' };
  },
  createListItemTextNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: 'list-item-text' };
  },
};
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
  resetHasChanged,
  saveChanges,
  audioAssetId,
  fetchAudio,
  chapterName,
  saveToDBQuiz,
  themeValue,
  openSmallCircleNav,
  toggleSmallCircleNav,
  toggleSideNav,
  usePlate,
}: {
  isPreviewing: boolean;
  setIsPreviewing: (t: boolean) => any;
  timeStamp: string;
  initialUserAssets: {
    cloudinaryImages: CloudinaryPublicPic[];
    muxAudiosWithNames: [Mux['data'][0], string][];
  };
  user: LuciaSession['user'];
  contentWS: WebSocket;
  initialValue: any;
  renderedHTML: string | undefined;
  isEditing: boolean;
  chapterId: string;
  hasChanged: boolean;
  setHasChanged: () => void;
  resetHasChanged: () => void;
  saveChanges: (
    contentEditorValue: string | null,
    renderedHTML: string,
    audio_track_playback_id: string | undefined,
    audio_track_asset_id: string | undefined
  ) => Promise<string>;
  audioAssetId: string | undefined;
  fetchAudio: QRL<
    (id: string) => Promise<{
      data: Mux['data'][0];
      filename: string;
    }>
  >;
  chapterName: string;
  saveToDBQuiz: (isCorrect: boolean) => any;
  themeValue: (typeof theme)[number];
  toggleSmallCircleNav: () => void;
  openSmallCircleNav: boolean;
  toggleSideNav: () => void;
  usePlate: boolean;
}) => {
  const normalizedInitialValue = initialValue ?? //     inputWidth: 400, //     removeTrailingSpaces: true, //     quizTitle: "Question 2", //     formName: "test2", //     astLang: "js", //     isCode: true, //     codeInput: "", //     }, //       displayAst: "{}", //       ast: "{}", //       matchInput: { blablabla: "=" }, //       type: "ast", //     ans: { //     type: "quizCodeBlock", //   { // ?? [
  //     inputCount: 1,
  //     children: [
  //       {
  //         type: "quizCodeParagraph",
  //         children: [
  //           { text: "let x " },
  //           {
  //             type: "quizCodeInput",
  //             inputWidth: 200,
  //             formName: "test2",
  //             children: [{ text: "" }],
  //             inputNumber: 0,
  //             inputId: "blablabla",
  //           },
  //           { text: " 10;" },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     type: "quizBlock",
  //     ans: "2",
  //     formName: "test",
  //     quizTitle: "Question 1",
  //     children: [
  //       {
  //         type: "quizOption",
  //         formName: "test",
  //         optionValue: "1",
  //         children: [{ text: "answer A" }],
  //       },
  //       {
  //         type: "quizOption",
  //         formName: "test",
  //         optionValue: "2",
  //         children: [{ text: "answer B" }],
  //       },
  //       {
  //         type: "quizOption",
  //         formName: "test",
  //         optionValue: "3",
  //         children: [{ text: "answer C" }],
  //       },
  //     ],
  //   },
  //   {
  //     type: "paragraph",
  //     children: [
  //       {
  //         text: "",
  //       },
  //       {
  //         type: "link",
  //         url: "https://google.com",
  //         children: [{ text: "this is a link" }],
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
  //     type: "paragraph",
  //     align: "center",
  //     children: [{ text: "Try it out for yourself!" }],
  //   },
  //   {
  //     type: "paragraph",
  //     children: [
  //       {
  //         text: "",
  //       },
  //     ],
  //   },
  // ];
  [
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
      ],
    },
  ];

  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() =>
    withLists(schema)(
      withTrailingNewLine(
        withQuizCode(withQuiz(withImages(withMarker(withLink(withEmbeds(withReact(withHistory(createEditor()))))))))
      )
    )
  );

  const userImages = useRef<[Promise<string>, CloudinaryPublicPic][]>([]);
  const userAudiosWithName = useRef<[Mux['data'][0], string][]>([]);

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
  const [showQuizBlockSettings, setShowQuizBlockSettings] = useState(false);
  const [showQuizCodeBlockSettings, setShowQuizCodeBlockSettings] = useState(false);

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
    console.log('Setting audio track');
    _setAudioTrack(props);
    setHasChanged();
  };
  const audioTimeStamp = useRef(0);
  const [isChangingContent, setIsChangingContent] = useState(false);

  useEffect(() => {
    console.log('Chapter ID:', chapterId);
    setIsChangingContent(true);
  }, [chapterId]);

  useEffect(() => {
    if (!isChangingContent) return;
    if (editor.children.length === 0) {
      setIsChangingContent(false);
      return;
    }
    console.log('rendering', normalizedInitialValue);
    // HistoryEditor.withoutSaving(editor, () =>
    //   Transforms.insertNodes(
    //     editor,
    //     { type: "paragraph", children: [{ text: "-" }] },
    //     { at: Editor.start(editor, []), mode: "highest" }
    //   )
    // );
    // HistoryEditor.withoutSaving(editor, () =>
    //   Transforms.removeNodes(editor, { at: Editor.start(editor, []), mode: "highest" })
    // );
    while (editor.children.length > 1) {
      HistoryEditor.withoutSaving(editor, () =>
        Transforms.removeNodes(editor, { at: Editor.start(editor, []), mode: 'highest' })
      );
    }
    if (
      normalizedInitialValue.length === 1 &&
      normalizedInitialValue[0].type === 'paragraph' &&
      normalizedInitialValue[0].children.length === 1 &&
      normalizedInitialValue[0].children[0].text === ''
    ) {
      //
    } else {
      for (let i = 0; i < normalizedInitialValue.length; i++) {
        const beforeEnd = Editor.before(editor, Editor.end(editor, []), { unit: 'block' });
        HistoryEditor.withoutSaving(editor, () =>
          Transforms.insertNodes(editor, normalizedInitialValue[i], {
            at: beforeEnd || [0],
            mode: 'highest',
          })
        );
      }
      // HistoryEditor.withoutSaving(editor, () =>
      //   Transforms.removeNodes(editor, { at: Editor.start(editor, []), mode: "highest" })
      // );
      HistoryEditor.withoutSaving(editor, () =>
        Transforms.removeNodes(editor, { at: Editor.end(editor, []), mode: 'highest' })
      );
    }

    setTimeout(() => {
      resetHasChanged();
      setIsChangingContent(false);
    }, 0);
  }, [isChangingContent]);

  const parentRef = useRef<any>();
  const [shikiji, setShikiji] = useState<HighlighterCore | undefined>();

  useEffect(() => {
    (async () => setShikiji(await getContentEditorHighlighter()))();
  }, []);

  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    if (audioAssetId) {
      setIsLoadingAudio(true);
      console.log('Loading audio: ' + audioAssetId);
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
    } else {
      _setAudioTrack(undefined);
    }
  }, [audioAssetId]);

  const [changingValue, setChangingValue] = useState(0);
  const [saveBeforePreview, setSaveBeforePreview] = useState(false);

  return (
    <>
      {isEditing && !usePlate && (
        <>
          <Preview
            setIsPreviewing={setIsPreviewing}
            hasAudioTrack={audioTrack === undefined}
            isPreviewing={isPreviewing}
            setSaveBeforePreview={setSaveBeforePreview}
          />
          <div
            ref={parentRef}
            id="ParentRefContainer"
            className={
              'relative flex h-full w-[100vw] flex-col items-center justify-center dark:bg-primary-dark-gray  dark:text-background-light-gray xl:w-[80vw] ' +
              (isPreviewing ? ' hidden ' : ' block ')
            }
          >
            <Slate
              onValueChange={() => {
                if (isChangingContent) return;
                setHasChanged();
                setChangingValue(changingValue + 1);
              }}
              editor={editor}
              initialValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
            >
              <SmallCircleNav
                toggleSmallCircleNav={toggleSmallCircleNav}
                openSmallCircleNav={openSmallCircleNav}
                toggleSideNav={toggleSideNav}
                setIsPreviewing={setIsPreviewing}
                hasAudioTrack={audioTrack === undefined}
                isPreviewing={isPreviewing}
                setSaveBeforePreview={setSaveBeforePreview}
                saveBeforePreview={saveBeforePreview}
                changingValue={changingValue}
                audioTrack={audioTrack}
                hasChanged={hasChanged}
                saveChanges={saveChanges}
                chapterName={chapterName}
                isEditing={isEditing}
              />
              <SaveContent
                setSaveBeforePreview={setSaveBeforePreview}
                saveBeforePreview={saveBeforePreview}
                setIsPreviewing={setIsPreviewing}
                changingValue={changingValue}
                audioTrack={audioTrack}
                hasChanged={hasChanged}
                saveChanges={saveChanges}
                chapterName={chapterName}
                isEditing={isEditing}
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
                <CenterCodeBlockSettings setShowCodeBlockSettings={setShowCodeBlockSettings} editor={editor} />
              )}
              {showQuizBlockSettings && (
                <CenterQuizBlockSettings setShowQuizBlockSettings={setShowQuizBlockSettings} editor={editor} />
              )}
              {showQuizCodeBlockSettings && (
                <CenterQuizCodeBlockSettings
                  setShowQuizCodeBlockSettings={setShowQuizCodeBlockSettings}
                  editor={editor}
                  themeValue={themeValue}
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
              <HoveringCodeBlock parentRef={parentRef} setShowCodeBlockSettings={setShowCodeBlockSettings} />
              <HoveringQuizBlock parentRef={parentRef} setShowQuizBlockSettings={setShowQuizBlockSettings} />
              <HoveringQuizCodeBlock
                parentRef={parentRef}
                setShowQuizCodeBlockSettings={setShowQuizCodeBlockSettings}
              />
              {/* <HoveringToolbar /> */}
              <Prose chapter={chapterName}>
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
              themeValue={themeValue}
            />
          </div>

          {isPreviewing && (
            <div className={'flex h-full w-[100vw] flex-col overflow-hidden xl:w-[80vw]'}>
              <QuizHydrate saveToDB={saveToDBQuiz} isPreview={true} />
              <QuizCodeHydrate saveToDB={saveToDBQuiz} isPreview={true} />
              {/* <EmbedHydrate /> */}
              <div className="overflow-auto" style={{ height: audioTrack ? '90vh' : '100vh' }}>
                <Prose chapter={chapterName} children={<></>} innerHTML={renderedHTML || ''} />
              </div>
              <SyncAudio audioTrack={audioTrack} />
            </div>
          )}
        </>
      )}
      {isEditing && usePlate && (
        <div
          className={
            'relative flex h-full w-[100vw] flex-col items-start overflow-auto dark:bg-primary-dark-gray  dark:text-background-light-gray xl:w-[80vw] '
          }
        >
          <PlateEditor />
        </div>
      )}
      {!isEditing && (
        <div className="flex h-full w-[100vw] items-center justify-center dark:text-background-light-gray xl:w-[80vw]">
          <div className="flex max-w-[800px] flex-col gap-3 px-6 text-center md:gap-4 lg:gap-6">
            <h1 className="text-center font-mosk text-[1.5rem] font-bold lg:text-[2rem]">
              Welcome to the Content Editor
            </h1>
            <p className="text-sm md:text-base">
              Start by selecting a course and chapter to edit in the navigation bar. You might need to click on the
              three dots to show it. If it is empty, go to{' '}
              <a target="_blank" href="/creator/" className="underline decoration-wavy underline-offset-4">
                Creator
              </a>{' '}
              and create a course :D
            </p>
            <p className="text-sm text-tomato md:text-base">
              Note: Content Editor is still in beta mode! Please kindly report any bugs and glitches to{' '}
              <a
                href="mailto:customer@partialty.com"
                target="_blank"
                className="underline decoration-wavy underline-offset-4"
              >
                customer@partialty.com
              </a>
            </p>
            <br />
            <div className="mx-auto hidden flex-col items-start gap-4 xl:flex">
              <div className="flex gap-4">
                <p className="w-[200px]">
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Ctrl
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Z
                  </kbd>{' '}
                  :
                </p>
                <p>Undo</p>
              </div>
              <div className="flex gap-4">
                <p className="w-[200px]">
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Ctrl
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Shift
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Z
                  </kbd>{' '}
                  :
                </p>
                <p>Redo</p>
              </div>
              <div className="flex gap-4">
                <p className="w-[200px]">
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Shift
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Enter
                  </kbd>{' '}
                  :
                </p>
                <p>Soft Break</p>
              </div>
              <div className="flex gap-4">
                <p className="w-[200px]">
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Ctrl
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Enter
                  </kbd>{' '}
                  :
                </p>
                <p>Hard Break (bottom)</p>
              </div>
              <div className="flex gap-4">
                <p className="w-[200px]">
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Ctrl
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Shift
                  </kbd>{' '}
                  +{' '}
                  <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-highlight-dark dark:text-gray-100">
                    Enter
                  </kbd>{' '}
                  :
                </p>
                <p>Hard Break (top)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default qwikify$(ContentEditorReact);
