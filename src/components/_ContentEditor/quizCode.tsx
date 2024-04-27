/** @jsxImportSource react */
import { Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { BaseRange } from 'slate';
import { Editor, Node, Range, Element as SlateElement, Transforms } from 'slate';
import { ReactEditor, useFocused, useSlate, useSlateStatic, type RenderElementProps } from 'slate-react';
import { v4 as uuidv4 } from 'uuid';
import astParse from '~/components/_ContentEditor/astParse';
import { isBlockActive } from '~/components/_ContentEditor/blockFn';
import serialize from '~/components/_ContentEditor/serialize';
import type { QuizCodeBlockElement, QuizCodeInputElement } from '~/components/_ContentEditor/types';
import type theme from '~/const/theme';

export const QuizCodeInput = ({ attributes, children, element }: RenderElementProps) => {
  const width = (element as QuizCodeInputElement).inputWidth;
  const name = (element as QuizCodeInputElement).formName;
  const number = (element as QuizCodeInputElement).inputNumber;
  const editor = useSlateStatic();
  const ref = useRef<any>();
  const parentRef = useRef<any>();
  useEffect(() => {
    parentRef.current = document.getElementById('ParentRefContainer');
  }, []);
  useEffect(() => {
    if (ref.current) {
      const slateNode = ReactEditor.toSlateNode(editor, ref.current);
      const path = ReactEditor.findPath(editor, slateNode);
      if (!path) console.error('Unable to find path for embed!');
      new ResizeObserver((e) => {
        if (ref.current) {
          if (parentRef.current && parentRef.current.className.includes('hidden')) return;
          editor.setNodes(
            {
              inputWidth: ref.current.offsetWidth,
            },
            {
              match: (n) => SlateElement.isElement(n) && n.type === 'quizCodeInput',
              mode: 'highest',
              at: path,
            }
          );
        }
      }).observe(ref.current);
    }
  }, [ref.current]);
  return (
    <div
      data-formname={name}
      data-inputnumber={number}
      className="inline-block border-inherit bg-inherit px-2 align-middle text-inherit"
      contentEditable={false}
      {...attributes}
    >
      <div
        style={{ width: `${width}px` }}
        className="quizCodeInput inline-block overflow-hidden rounded-md border-2 border-inherit bg-inherit align-middle text-inherit [resize:horizontal]"
        ref={ref}
      >
        <input
          className="w-[calc(100%-8px)] whitespace-nowrap border-inherit bg-inherit px-2 text-inherit outline-none"
          type="text"
        />
        {children}
      </div>
    </div>
  );
};

export const QuizCodeParagraph = ({ attributes, children, element }: RenderElementProps) => {
  return (
    <div {...attributes} className="block border-inherit bg-inherit text-inherit">
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
  const parentRef = useRef<any>();

  useEffect(() => {
    parentRef.current = document.getElementById('ParentRefContainer');
  }, []);
  useEffect(() => {
    if (ref.current) {
      const slateNode = ReactEditor.toSlateNode(editor, ref.current);
      const path = ReactEditor.findPath(editor, slateNode);
      if (!path) console.error('Unable to find path for embed!');
      new ResizeObserver((e) => {
        if (parentRef.current && parentRef.current.className.includes('hidden')) return;
        if (ref.current)
          editor.setNodes(
            {
              inputWidth: ref.current.offsetWidth,
            },
            {
              match: (n) => SlateElement.isElement(n) && n.type === 'quizCodeBlock',
              mode: 'highest',
              at: path,
            }
          );
      }).observe(ref.current);
    }
  }, [ref.current]);
  return (
    <div {...attributes} className="mb-[1.25rem] mt-[1.25rem] bg-inherit text-inherit">
      {/* <h3 className="mb-3 mt-0 bg-inherit text-inherit" contentEditable={false}>
        {(element as QuizCodeBlockElement).quizTitle}
      </h3> */}
      <form
        data-ans={JSON.stringify((element as QuizCodeBlockElement).ans)}
        data-formname={(element as QuizCodeBlockElement).formName}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="quizCodeBlock flex flex-col items-start gap-3 bg-inherit text-inherit"
      >
        <button
          type="button"
          className="rounded-lg bg-primary-dark-gray px-3 py-1 text-base text-background-light-gray shadow-md dark:bg-highlight-dark"
          contentEditable={false}
          onClick={() => {
            if (!editor.selection) return;
            const id = uuidv4();
            Transforms.insertNodes(
              editor,
              {
                type: 'quizCodeInput',
                inputWidth: 200,
                children: [{ text: '', isCodeQuizInput: id }],
                formName,
                inputId: id,
                inputNumber: inputCount,
              },
              {
                // match: (n) => SlateElement.isElement(n) && n.type === "quizCodeParagraph",
                mode: 'highest',
              }
            );

            editor.setNodes(
              {
                inputCount: inputCount + 1,
              },
              {
                match: (n) => SlateElement.isElement(n) && n.type === 'quizCodeBlock',
                mode: 'highest',
              }
            );
          }}
        >
          Add input field
        </button>
        <div
          style={{ width: `${width}px` }}
          className="overflow-hidden whitespace-pre rounded-sm border-2 border-primary-dark-gray bg-inherit p-2 align-middle text-inherit [resize:horizontal] dark:border-highlight-dark"
          ref={ref}
        >
          {isCode ? (
            <pre className="m-0 w-[calc(100%-8px)] overflow-auto border-background-light-gray [&_.quizCodeInput]:bg-background-light-gray [&_.quizCodeInput]:text-primary-dark-gray">
              <code className="border-inherit [&>div:last-child]:pb-0 [&>div]:pb-2">{children}</code>
            </pre>
          ) : (
            <div className="w-[calc(100%-8px)] overflow-auto border-primary-dark-gray bg-background-light-gray dark:border-highlight-dark dark:bg-primary-dark-gray [&>div:last-child]:pb-0 [&>div]:pb-2">
              {children}
            </div>
          )}
        </div>
        <div contentEditable={false} className="flex items-center gap-3">
          <button
            contentEditable={false}
            className="formCheck rounded-lg bg-primary-dark-gray px-6 py-2 text-background-light-gray shadow-lg dark:bg-highlight-dark"
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
            <div className="inline-block rounded-lg bg-tomato px-6 py-2 text-light-tomato shadow-lg">Wrong</div>
            <p className="m-0 pt-1 text-sm text-tomato"></p>
          </div>
          <button
            contentEditable={false}
            className="formShow rounded-lg bg-primary-dark-gray px-6 py-2 text-background-light-gray shadow-lg dark:bg-highlight-dark"
          >
            Show Ans
          </button>
        </div>
      </form>
    </div>
  );
};

export const withQuizCode = (editor: Editor) => {
  const { isInline, onChange } = editor;
  editor.isInline = (element) => ['quizCodeInput'].includes(element.type) || isInline(element);
  editor.onChange = (props) => {
    const parent = editor.above({
      match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) && n.type === 'quizCodeBlock',
    });
    if (parent) {
      editor.setNodes(
        {
          combinedText: encodeURIComponent(JSON.stringify(Array.from(Node.texts(parent[0])).map((x) => x[0]))),
        },
        {
          match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) && n.type === 'quizCodeBlock',
        }
      );
    }
    onChange(props);
  };
  return editor;
};

export const CenterQuizCodeBlockSettings = ({
  editor,
  setShowQuizCodeBlockSettings,
  themeValue,
}: {
  editor: Editor;
  setShowQuizCodeBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
  themeValue: (typeof theme)[number];
}) => {
  const matching = editor.above({
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'quizCodeBlock',
  });
  if (!matching) return null;
  const quizCodeBlock = matching[0] as QuizCodeBlockElement;
  const [quizTitle, setQuizTitle] = useState(quizCodeBlock.quizTitle || '');
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [quizMatchInput, setQuizMatchInput] = useState(quizCodeBlock.ans.matchInput || {});
  const [quizAst, setQuizAst] = useState(quizCodeBlock.ans.type === 'ast');
  const [ast, setAst] = useState(quizCodeBlock.displayAst || '{}');
  const [astInputCode, setAstInputCode] = useState(quizCodeBlock.codeInput || '');
  const [astGenerateLanguage, setAstGenerateLanguage] = useState(quizCodeBlock.astLang || 'js');
  const [showAst, setShowAst] = useState(false);
  const [removeTrailingSpaces, setRemoveTrailingSpaces] = useState(!!quizCodeBlock.removeTrailingSpaces);
  const [isCode, setIsCode] = useState(!!quizCodeBlock.isCode);
  const [rendered, setRendered] = useState('');
  const ref = useRef<any>();
  const width = (matching[0] as QuizCodeBlockElement).inputWidth;

  useEffect(() => {
    (async () => {
      setRendered(await serialize(matching[0].children, true));
    })();
  }, [ref.current]);

  useEffect(() => {
    if (!ref.current) return;
    const inputList = Array.from(ref.current.getElementsByClassName('quizCodeInput')) as HTMLElement[];
    const final: Record<string, string> = {};
    for (const i of inputList) {
      const id = i.parentElement?.getAttribute('data-id');
      if (!id || !i.firstElementChild) continue;
      if (Object.prototype.hasOwnProperty.call(quizMatchInput, id)) {
        final[id] = quizMatchInput[id];
      } else final[id] = '';
      if (quizAst && isCode) {
        (i.firstElementChild as HTMLInputElement).disabled = true;
        i.style.setProperty('background-color', 'rgb(209 213 219)', 'important');
        (i.firstElementChild as HTMLInputElement).value = '';
      } else {
        (i.firstElementChild as HTMLInputElement).disabled = false;
        (i.firstElementChild as HTMLInputElement).value = Object.prototype.hasOwnProperty.call(quizMatchInput, id)
          ? quizMatchInput[id]
          : '';
        i.style.setProperty('background-color', 'inherit');
      }
      (i.firstElementChild as HTMLInputElement).oninput = () => {
        setQuizMatchInput({
          ...quizMatchInput,
          [id]: (i.firstElementChild as HTMLInputElement).value,
        });
      };
    }
    setQuizMatchInput(final);
  }, [rendered, isCode, quizAst]);

  return (
    <div className="fixed left-0 top-0 z-[999] flex h-[100vh] w-[100vw] items-center justify-center backdrop-blur-sm">
      <div className="relative flex max-h-[80vh] w-[95vw] flex-wrap items-stretch justify-evenly overflow-auto rounded-lg border-2 border-primary-dark-gray bg-light-mint p-8 dark:bg-primary-dark-gray lg:w-[80vw]">
        <div className="flex flex-col items-start justify-center">
          <h2 className="py-8 font-mosk text-[2rem] font-bold tracking-wider">Configure Quiz</h2>
          <button onClick={() => setShowQuizCodeBlockSettings(false)} className="absolute right-8 top-8 p-2">
            <X size={20} />
          </button>
          {/* <div>
            <label htmlFor="QuizCodeTitle" className="cursor-pointer">
              Quiz Title
            </label>
            <div className="pt-1">
              <input
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                id="QuizCodeTitle"
                name="QuizCodeTitle"
                type="text"
                className={
                  'block w-[300px] rounded-md border-2 border-primary-dark-gray px-3 py-2 dark:bg-highlight-dark'
                }
              />
            </div>
          </div>
          <br /> */}
          <div className="flex items-center gap-3">
            <label htmlFor="QuizCodeAns" className="cursor-pointer">
              Is code template
            </label>
            <input
              className="h-4 w-4"
              id="QuizCodeAns"
              type="checkbox"
              checked={isCode}
              onChange={(e) => setIsCode((e.target as HTMLInputElement).checked)}
            />
          </div>
          {isCode && (
            <>
              <br />
              <div className="flex items-center gap-3">
                <label htmlFor="QuizCodeAst" className="cursor-pointer">
                  Use Ast matching
                </label>
                <input
                  className="h-4 w-4"
                  id="QuizCodeAst"
                  type="checkbox"
                  checked={quizAst}
                  onChange={(e) => setQuizAst((e.target as HTMLInputElement).checked)}
                />
              </div>
            </>
          )}

          {(!isCode || !quizAst) && (
            <>
              <br />
              <div className="flex items-center gap-3">
                <label htmlFor="QuizCodeTrailingSpaces" className="cursor-pointer">
                  Remove trailing spaces
                </label>
                <input
                  className="h-4 w-4"
                  id="QuizCodeTrailingSpaces"
                  type="checkbox"
                  checked={removeTrailingSpaces}
                  onChange={(e) => setRemoveTrailingSpaces((e.target as HTMLInputElement).checked)}
                />
              </div>
            </>
          )}
          <button
            onClick={() => {
              editor.setNodes(
                {
                  quizTitle,
                  isCode,
                  ans: {
                    type: quizAst ? 'ast' : 'matchInput',
                    ast: ast,
                    // astInputCode !== '' && Object.prototype.hasOwnProperty.call(astParse, astGenerateLanguage)
                    //   ? JSON.stringify(astParse[astGenerateLanguage](astInputCode))
                    //   : '{}',
                    matchInput: quizMatchInput,
                  },
                  astLang: astGenerateLanguage,
                  displayAst: ast,
                  codeInput: astInputCode,
                },
                {
                  match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) && n.type === 'quizCodeBlock',
                }
              );
              setShowQuizCodeBlockSettings(false);
            }}
            className="my-8 inline-block rounded-lg bg-primary-dark-gray px-8 py-4 text-background-light-gray dark:bg-highlight-dark"
          >
            Save
          </button>
        </div>

        <div className="flex max-w-full flex-col gap-3">
          {!showAst && (
            <>
              <div className="flex gap-4">
                <h3 className="font-mosk text-2xl font-bold tracking-wider">Answer</h3>
                {isCode && (
                  <button
                    type="button"
                    onClick={() => setShowAst(true)}
                    className="text-base underline decoration-wavy underline-offset-4"
                  >
                    Switch to AST
                  </button>
                )}
              </div>
              <div
                style={{
                  background: isCode ? '#282c34' : themeValue === 'light' ? 'rgb(247 247 247)' : '#2f3e52',
                  borderColor: isCode ? 'transparent' : '#282c34',
                }}
                className={'max-h-[500px] max-w-full flex-1 overflow-auto rounded-lg border-2 p-4'}
              >
                {isCode ? (
                  <pre
                    ref={ref}
                    style={{ width: `${width}px` }}
                    className="overflow-auto whitespace-nowrap border-background-light-gray bg-code-editor-one-dark-pro text-lg text-background-light-gray [&_.quizCodeInput]:!bg-background-light-gray [&_.quizCodeInput]:!text-primary-dark-gray"
                  >
                    <code dangerouslySetInnerHTML={{ __html: rendered }}></code>
                  </pre>
                ) : (
                  <div
                    ref={ref}
                    style={{ width: `${width}px` }}
                    className="overflow-auto whitespace-nowrap border-primary-dark-gray bg-background-light-gray text-lg dark:bg-highlight-dark"
                    dangerouslySetInnerHTML={{ __html: rendered }}
                  ></div>
                )}
              </div>
            </>
          )}

          {showAst && (
            <>
              <div className="flex gap-4">
                <h3 className="font-mosk text-2xl font-bold tracking-wider">AST</h3>
                <button
                  type="button"
                  onClick={() => setShowAst(false)}
                  className="text-base underline decoration-wavy underline-offset-4"
                >
                  Switch to Code
                </button>
              </div>
              <div className={'flex max-w-full flex-1 items-start justify-evenly gap-2'}>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <h4 className="font-mosk text-xl font-bold tracking-wider">AST Tree</h4>
                    <button
                      type="button"
                      className="rounded-md bg-primary-dark-gray px-2 py-1 text-base text-background-light-gray shadow-md"
                      onClick={async () => {
                        const copyText = document.getElementById('ASTText');
                        if (!copyText) return;

                        try {
                          await navigator.clipboard.writeText((copyText as HTMLTextAreaElement).value);
                          window.alert('Copied code');
                        } catch (err) {
                          alert('Failed to copy: ' + (err as any).toString());
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="h-[400px] w-[400px] overflow-hidden rounded-lg border-2 border-primary-dark-gray bg-background-light-gray p-4 dark:bg-highlight-dark">
                    <textarea
                      value={ast}
                      id="ASTText"
                      onChange={(e) => setAst(e.target.value)}
                      placeholder={
                        "AST matching will check if all the properties listed in the answer's AST is prsent in user's AST. Extra properties/values from the user's AST are also accepted. If the AST object is an array, the order will also be checked."
                      }
                      className="h-full w-full resize-none overflow-auto bg-background-light-gray outline-none dark:bg-highlight-dark"
                    ></textarea>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-mosk text-xl font-bold tracking-wider">Code Input</h4>
                  <div className="h-[400px] w-[400px] overflow-hidden rounded-lg border-2 border-primary-dark-gray bg-background-light-gray p-4 dark:bg-highlight-dark">
                    <textarea
                      value={astInputCode}
                      onChange={(e) => setAstInputCode(e.target.value)}
                      placeholder={'Enter some code and click generate.'}
                      className="h-full w-full resize-none overflow-auto bg-background-light-gray outline-none dark:bg-highlight-dark"
                    ></textarea>
                  </div>
                  <div className="flex justify-start gap-3 self-start">
                    <button
                      type="button"
                      className="rounded-lg bg-primary-dark-gray px-2 py-1 text-base text-background-light-gray shadow-md dark:bg-highlight-dark"
                      onClick={() => {
                        if (Object.prototype.hasOwnProperty.call(astParse, astGenerateLanguage))
                          setAst(JSON.stringify(astParse[astGenerateLanguage](astInputCode), null, 2));
                      }}
                    >
                      Generate
                    </button>
                    <select
                      className="rounded-lg border-2 border-primary-dark-gray px-3 py-1 shadow-md outline-none dark:bg-highlight-dark"
                      onChange={(e) => setAstGenerateLanguage(e.target.value)}
                      value={astGenerateLanguage}
                    >
                      <option value="js">JS/TS/JSX</option>
                      <option value="css">CSS</option>
                      <option value="html">HTML</option>
                      <option value="svelte">Svelte</option>
                      <option value="vue3">Vue 3</option>
                      <option value="mysql">MYSQL</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const HoveringQuizCodeBlock = ({
  parentRef,
  setShowQuizCodeBlockSettings,
  offsetX = 0,
  offsetY = 10,
}: {
  parentRef: React.MutableRefObject<any>;
  setShowQuizCodeBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
  offsetX?: number;
  offsetY?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  const prevSelection = useRef<BaseRange | null>();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el || !selection) {
      if (el && !selection) el.style.display = 'none';
      return;
    }

    prevSelection.current = selection;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'quizCodeBlock',
    });
    if (!node) {
      el.style.display = 'none';
      return;
    }
    const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);

    const { x: nodeX, height: nodeHeight, y: _nodeY, width: nodeWidth } = linkDOMNode.getBoundingClientRect();

    const nodeY = _nodeY + document.documentElement.scrollTop;

    let parentNodeX: number = 0;
    if (parentRef.current) parentNodeX = parentRef.current.getBoundingClientRect().x;

    if (
      (!inFocus &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (prevSelection.current === undefined || prevSelection.current === null)) ||
      !Range.isCollapsed(selection)
    ) {
      el.style.display = 'none';
      return;
    }

    el.style.display = 'flex';
    el.style.top = `${Math.min(nodeY + nodeHeight + offsetY, window.innerHeight * 0.9 - el.offsetHeight)}px`;
    el.style.left = `${nodeX + nodeWidth / 2 + offsetX - parentNodeX}px`;
    el.style.transform = 'translateX(-50%)';
  });

  return (
    <>
      {isBlockActive(editor, 'quizCodeBlock', 'type') && (
        <div
          ref={ref}
          className="absolute z-[60] flex flex-col items-center justify-start text-inherit shadow-xl"
          role="group"
        >
          <div className="inline-flex rounded-md text-inherit" role="group">
            <button
              onClick={() => setShowQuizCodeBlockSettings(true)}
              type="button"
              className="rounded-s-lg border border-custom-yellow bg-background-light-gray/50 px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
            >
              Settings
            </button>
            <button
              onClick={() => toggleQuizCodeBlockAtSelection(editor)}
              type="button"
              className="rounded-e-lg border border-custom-yellow bg-background-light-gray/50 px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
            >
              <Trash strokeWidth={1.5} size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export function toggleQuizCodeBlockAtSelection(editor: Editor) {
  Transforms.removeNodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === 'quizCodeBlock',
  });
}
