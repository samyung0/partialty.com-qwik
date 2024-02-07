/** @jsxImportSource react */
import { useEffect, useRef } from "react";
import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlateStatic, type RenderElementProps } from "slate-react";
import type { QuizCodeBlockElement, QuizCodeInputElement } from "~/components/ContentEditor/types";

export const QuizCodeInput = ({ attributes, children, element }: RenderElementProps) => {
  const width = (element as QuizCodeInputElement).inputWidth;
  const name = (element as QuizCodeInputElement).formName;
  const number = (element as QuizCodeInputElement).inputNumber;
  const editor = useSlateStatic();
  const ref = useRef<any>();
  useEffect(() => {
    if (ref.current)
      new ResizeObserver((e) => {
        if (ref.current)
          editor.setNodes(
            {
              inputWidth: ref.current.offsetWidth,
            },
            {
              match: (n) => SlateElement.isElement(n) && n.type === "quizCodeInput",
              mode: "highest",
            }
          );
      }).observe(ref.current);
  }, []);
  return (
    <div
      data-formname={name}
      data-inputnumber={number}
      className="inline-block border-inherit bg-inherit px-2 align-middle text-inherit"
      {...attributes}
      contentEditable={false}
    >
      <div
        style={{ width: `${width}px` }}
        className="inline-block overflow-hidden rounded-md border-2 border-inherit bg-inherit align-middle text-inherit [resize:horizontal]"
        ref={ref}
      >
        <div className="w-[calc(100%-8px)] whitespace-pre px-2">{children}</div>
        {/* <input
          onChange={e => {
          }}
          name={name}
          type="text"
          className="inline-block w-[calc(100%-8px)] border-none bg-inherit px-2 text-inherit outline-none"
        /> */}
      </div>
    </div>
  );
};

export const QuizCodeParagraph = ({ attributes, children, element }: RenderElementProps) => {
  return (
    <div {...attributes} className="block border-inherit bg-inherit  text-inherit">
      {children}
    </div>
  );
};

export const QuizCodeBlock = ({ attributes, children, element }: RenderElementProps) => {
  const width = (element as QuizCodeBlockElement).inputWidth;
  const formName = (element as QuizCodeBlockElement).formName;
  const inputCount = (element as QuizCodeBlockElement).inputCount;
  const isCode = (element as QuizCodeBlockElement).isCode;
  const editor = useSlateStatic();
  const ref = useRef<any>();
  useEffect(() => {
    if (ref.current)
      new ResizeObserver((e) => {
        if (ref.current)
          editor.setNodes(
            {
              inputWidth: ref.current.offsetWidth,
            },
            {
              match: (n) => SlateElement.isElement(n) && n.type === "quizCodeBlock",
              mode: "highest",
            }
          );
      }).observe(ref.current);
  }, []);
  return (
    <div {...attributes} className="mb-[1.25rem] mt-[1.25rem] bg-inherit text-inherit">
      <h3 className="mb-3 mt-0 bg-inherit text-inherit" contentEditable={false}>
        {(element as QuizCodeBlockElement).quizTitle}
      </h3>
      <form
        data-ans={JSON.stringify((element as QuizCodeBlockElement).ans)}
        data-formname={(element as QuizCodeBlockElement).formName}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="quizBlock flex flex-col items-start gap-3 bg-inherit text-inherit"
      >
        <button
          type="button"
          className="rounded-lg bg-primary-dark-gray px-4 py-2 text-base text-background-light-gray shadow-md"
          contentEditable={false}
          onClick={() => {
            if (!editor.selection) return;
            Transforms.insertNodes(
              editor,
              {
                type: "quizCodeInput",
                inputWidth: 200,
                children: [{ text: "" }],
                formName,
                inputNumber: inputCount,
              },
              {
                // match: (n) => SlateElement.isElement(n) && n.type === "quizCodeParagraph",
                mode: "highest",
              }
            );

            editor.setNodes(
              {
                inputCount: inputCount + 1,
              },
              {
                match: (n) => SlateElement.isElement(n) && n.type === "quizCodeBlock",
                mode: "highest",
              }
            );
          }}
        >
          Add input field
        </button>
        <div
          style={{ width: `${width}px` }}
          className="overflow-hidden whitespace-nowrap rounded-sm border-2 border-primary-dark-gray bg-inherit p-2 align-middle text-inherit [resize:horizontal]"
          ref={ref}
        >
          {isCode ? (
            <pre className="m-0 w-[calc(100%-8px)] overflow-auto border-background-light-gray">
              <code className="border-inherit">{children}</code>
            </pre>
          ) : (
            <div className="w-[calc(100%-8px)] overflow-auto border-primary-dark-gray">
              {children}
            </div>
          )}
        </div>
        <button
          contentEditable={false}
          className="formCheck rounded-lg bg-primary-dark-gray px-6 py-2 text-background-light-gray shadow-lg"
        >
          Check
        </button>
        <div
          contentEditable={false}
          className="formCorrect hidden rounded-lg bg-mint-down px-6 py-2 text-light-mint shadow-lg"
        >
          Correct
        </div>
        <div contentEditable={false} className="formWrong hidden">
          <div className="inline-block rounded-lg bg-tomato px-6 py-2 text-light-tomato shadow-lg">
            Wrong
          </div>
          <p className="m-0 pt-1 text-sm text-tomato">sads aDA SD asd asd sa</p>
        </div>
      </form>
    </div>
  );
};

export const withQuizCode = (editor: Editor) => {
  const { isInline } = editor;
  editor.isInline = (element) => ["quizCodeInput"].includes(element.type) || isInline(element);
  return editor;
};

// export const CenterQuizBlockSettings = ({
//   editor,
//   setShowQuizBlockSettings,
// }: {
//   editor: Editor;
//   setShowQuizBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const matching = editor.above({
//     match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "quizBlock",
//   });
//   if (!matching) {
//     setShowQuizBlockSettings(false);
//     return null;
//   }
//   const quizBlock = matching[0] as QuizBlockElement;
//   const [quizTitle, setQuizTitle] = useState(quizBlock.quizTitle || "");
//   const [quizAns, setQuizAns] = useState(quizBlock.ans || "");
//   const noOfOptions = quizBlock.children.length;
//   return (
//     <div className="fixed left-0 top-0 z-[999] flex h-[100vh] w-[100vw] items-center justify-center backdrop-blur-sm">
//       <div className="relative flex w-[80vw] flex-col items-center justify-center rounded-lg border-2 border-primary-dark-gray bg-light-mint p-8">
//         <h2 className="py-8 font-mosk text-[2rem] font-bold tracking-wider">Configure Codeblock</h2>
//         <button
//           onClick={() => setShowQuizBlockSettings(false)}
//           className="absolute right-8 top-8 p-2"
//         >
//           <X size={20} />
//         </button>
//         <div>
//           <label htmlFor="QuizTitle" className="cursor-pointer text-lg">
//             Quiz Title
//           </label>
//           <div className="pt-1">
//             <input
//               value={quizTitle}
//               onChange={(e) => setQuizTitle(e.target.value)}
//               id="QuizTitle"
//               name="QuizTitle"
//               type="text"
//               className={"block w-[300px] rounded-md border-2 border-primary-dark-gray px-3 py-2"}
//             />
//           </div>
//         </div>
//         <br />
//         <div>
//           <label htmlFor="QuizAnswer" className="cursor-pointer text-lg">
//             Quiz Answer
//           </label>
//           <div className="pt-1">
//             <select
//               value={quizAns}
//               onChange={(e) => setQuizAns(e.target.value)}
//               id="QuizAnswer"
//               className={"block w-[300px] rounded-md border-2 border-primary-dark-gray px-3 py-2"}
//             >
//               {Array.from(Array(noOfOptions)).map((_, index) => (
//                 <option key={`quizBlockSettingsOption${index}`} value={(index + 1).toString()}>
//                   Option {index + 1}
//                 </option>
//               ))}
//               {/* {languageList.map((language) => (
//                 <option key={`codeBlockSettings${language}`} value={language}>
//                   {languageListDisplayNames[language]}
//                 </option>
//               ))} */}
//             </select>
//           </div>
//         </div>
//         <button
//           onClick={() => {
//             editor.setNodes(
//               { quizTitle, ans: quizAns },
//               {
//                 match: (n) =>
//                   SlateElement.isElement(n) && Editor.isBlock(editor, n) && n.type === "quizBlock",
//               }
//             );
//             setShowQuizBlockSettings(false);
//           }}
//           className="my-8 inline-block rounded-lg bg-primary-dark-gray px-8 py-4 text-background-light-gray"
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export const HoveringQuizBlock = ({
//   parentRef,
//   setShowQuizBlockSettings,
//   offsetX = 0,
//   offsetY = 10,
// }: {
//   parentRef: React.MutableRefObject<any>;
//   setShowQuizBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
//   offsetX?: number;
//   offsetY?: number;
// }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const editor = useSlate();
//   const inFocus = useFocused();

//   const prevSelection = useRef<BaseRange | null>();

//   useEffect(() => {
//     const el = ref.current;
//     const { selection } = editor;

//     if (!el || !selection) {
//       if (el && !selection) el.style.display = "none";
//       return;
//     }

//     prevSelection.current = selection;
//     const node = Editor.above(editor, {
//       match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "quizBlock",
//     });
//     if (!node) {
//       el.style.display = "none";
//       return;
//     }
//     const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);

//     const {
//       x: nodeX,
//       height: nodeHeight,
//       y: _nodeY,
//       width: nodeWidth,
//     } = linkDOMNode.getBoundingClientRect();

//     const nodeY = _nodeY + document.documentElement.scrollTop;

//     let parentNodeX: number = 0;
//     if (parentRef.current) parentNodeX = parentRef.current.getBoundingClientRect().x;

//     if (
//       (!inFocus &&
//         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//         (prevSelection.current === undefined || prevSelection.current === null)) ||
//       !Range.isCollapsed(selection)
//     ) {
//       el.style.display = "none";
//       return;
//     }

//     el.style.display = "flex";
//     el.style.top = `${nodeY + nodeHeight + offsetY}px`;
//     el.style.left = `${nodeX + nodeWidth / 2 + offsetX - parentNodeX}px`;
//     el.style.transform = "translateX(-50%)";
//   });

//   return (
//     <>
//       {isBlockActive(editor, "quizBlock", "type") && (
//         <div
//           ref={ref}
//           className="absolute z-[60] flex flex-col items-center justify-start bg-light-yellow shadow-xl"
//           role="group"
//         >
//           <div className="inline-flex rounded-md" role="group">
//             <button
//               onClick={() => setShowQuizBlockSettings(true)}
//               type="button"
//               className="rounded-s-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
//             >
//               Settings
//             </button>
//             <button
//               onClick={() => toggleQuizBlockAtSelection(editor)}
//               type="button"
//               className="rounded-e-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
//             >
//               <Trash strokeWidth={1.5} size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export function toggleQuizBlockAtSelection(editor: Editor) {
//   Transforms.removeNodes(editor, {
//     match: (n) => SlateElement.isElement(n) && n.type === "quizBlock",
//   });
// }
