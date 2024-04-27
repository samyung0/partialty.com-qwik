/** @jsxImportSource react */
import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Editor, Element as SlateElement, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import ColorChooser from '~/components/_ContentEditor/ColorChooser';
import { isBlockActive } from '~/components/_ContentEditor/blockFn';
import type { CustomMarkFormat, InlineMarkerBackground } from '~/components/_ContentEditor/types';

export const MarkButton = ({
  format,
  children,
  title,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
  title?: string;
}) => {
  const editor = useSlate();
  return (
    <button
      title={title}
      className={
        isMarkActive(editor, format)
          ? `border-b-2 border-black dark:border-light-mint`
          : 'border-b-2 border-light-mint dark:border-primary-dark-gray'
      }
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

export const BackgroundMarkButton = ({
  children,
  audioTimeStamp,
}: {
  children: React.ReactNode;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  const editor = useSlate();
  const node = Editor.above(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground',
  });
  return (
    <div
      title={'Background'}
      className={
        (isBlockActive(editor, 'markerBackground', 'type')
          ? `border-b-2 border-black dark:border-light-mint `
          : 'border-b-2 border-light-mint dark:border-primary-dark-gray ') +
        ' relative cursor-pointer [&:hover>div]:block'
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <ColorChooser
          node={node ? node[0] : {}}
          getTime={() => audioTimeStamp.current}
          setSync={() => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerBackground', 'type')) return;
            if (!node) return;
            if ((node[0] as InlineMarkerBackground).sync)
              Transforms.setNodes(
                editor,
                {
                  sync: undefined,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
              );
            else
              Transforms.setNodes(
                editor,
                {
                  sync: true,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
              );
          }}
          setTimeStamp={(timestamp: number) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerBackground', 'type')) return;
            if (!node) return;
            // if ((node[0] as InlineMarkerBackground).timeStamp)
            //   Transforms.setNodes(
            //     editor,
            //     {
            //       timeStamp: undefined,
            //     },
            //     { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
            //   );
            // else
            Transforms.setNodes(
              editor,
              {
                timeStamp: timestamp,
              },
              { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
            );
          }}
          setAnimate={() => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerBackground', 'type')) return;
            if (!node) return;
            if ((node[0] as InlineMarkerBackground).animate)
              Transforms.setNodes(
                editor,
                {
                  animate: undefined,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
              );
            else
              Transforms.setNodes(
                editor,
                {
                  animate: true,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
              );
          }}
          setColor={(color: string) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerBackground', 'type')) {
              const attr = {
                type: 'markerBackground',
                children: [],
                background: color,
              };
              Transforms.wrapNodes(editor, attr as any, { split: true });
            } else {
              Transforms.setNodes(
                editor,
                {
                  background: color,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
              );
            }
          }}
          setColorDarkMode={(color: string) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerBackground', 'type')) return;

            Transforms.setNodes(
              editor,
              {
                backgroundDarkMode: color,
              },
              { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground' }
            );
          }}
          removeColor={() => {
            if (!editor.selection) return;
            Transforms.unwrapNodes(editor, {
              match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerBackground',
            });
            // Editor.removeMark(editor, format);
            // Editor.removeMark(editor, 'backgroundDarkMode');
            // Editor.removeMark(editor, 'timeStamp');
            // Editor.removeMark(editor, 'sync');
            // Editor.removeMark(editor, 'animate');
          }}
        />
      </div>
    </div>
  );
};

export const UnderlineMarkButton = ({
  children,
  audioTimeStamp,
}: {
  children: React.ReactNode;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  const editor = useSlate();
  const node = Editor.above(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline',
  });
  return (
    <div
      title={'Underline'}
      className={
        (isBlockActive(editor, 'markerUnderline', 'type')
          ? `border-b-2 border-black dark:border-light-mint `
          : 'border-b-2 border-light-mint dark:border-primary-dark-gray ') +
        ' relative cursor-pointer [&:hover>div]:block'
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <ColorChooser
          node={node ? node[0] : {}}
          getTime={() => audioTimeStamp.current}
          setSync={() => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerUnderline', 'type')) return;
            if (!node) return;
            if ((node[0] as InlineMarkerBackground).sync)
              Transforms.setNodes(
                editor,
                {
                  sync: undefined,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
              );
            else
              Transforms.setNodes(
                editor,
                {
                  sync: true,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
              );
          }}
          setTimeStamp={(timestamp: number) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerUnderline', 'type')) return;
            if (!node) return;
            // if ((node[0] as InlineMarkerBackground).timeStamp)
            //   Transforms.setNodes(
            //     editor,
            //     {
            //       timeStamp: undefined,
            //     },
            //     { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
            //   );
            // else
            Transforms.setNodes(
              editor,
              {
                timeStamp: timestamp,
              },
              { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
            );
          }}
          setAnimate={() => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerUnderline', 'type')) return;
            if (!node) return;
            if ((node[0] as InlineMarkerBackground).animate)
              Transforms.setNodes(
                editor,
                {
                  animate: undefined,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
              );
            else
              Transforms.setNodes(
                editor,
                {
                  animate: true,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
              );
          }}
          setColor={(color: string) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerUnderline', 'type')) {
              const attr = {
                type: 'markerUnderline',
                children: [],
                underline: color,
              };
              Transforms.wrapNodes(editor, attr as any, { split: true });
            } else {
              Transforms.setNodes(
                editor,
                {
                  underline: color,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
              );
            }
          }}
          setColorDarkMode={(color: string) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerUnderline', 'type')) return;

            Transforms.setNodes(
              editor,
              {
                underlineDarkMode: color,
              },
              { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline' }
            );
          }}
          removeColor={() => {
            if (!editor.selection) return;
            Transforms.unwrapNodes(editor, {
              match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerUnderline',
            });
            // Editor.removeMark(editor, format);
            // Editor.removeMark(editor, 'backgroundDarkMode');
            // Editor.removeMark(editor, 'timeStamp');
            // Editor.removeMark(editor, 'sync');
            // Editor.removeMark(editor, 'animate');
          }}
        />
      </div>
    </div>
  );
};

export const ColorMarkButton = ({
  children,
  audioTimeStamp,
}: {
  children: React.ReactNode;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  const editor = useSlate();
  const node = Editor.above(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerColor',
  });
  return (
    <div
      title={'Color'}
      className={
        (isBlockActive(editor, 'markerColor', 'type')
          ? `border-b-2 border-black dark:border-light-mint `
          : 'border-b-2 border-light-mint dark:border-primary-dark-gray ') +
        ' relative cursor-pointer [&:hover>div]:block'
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <ColorChooser
          canSync={false}
          canAnimate={false}
          node={node ? node[0] : {}}
          getTime={() => audioTimeStamp.current}
          setSync={() => {}}
          setAnimate={() => {}}
          setTimeStamp={() => {}}
          setColor={(color: string) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerColor', 'type')) {
              const attr = {
                type: 'markerColor',
                children: [],
                color: color,
              };
              Transforms.wrapNodes(editor, attr as any, { split: true });
            } else {
              Transforms.setNodes(
                editor,
                {
                  color: color,
                },
                { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerColor' }
              );
            }
          }}
          setColorDarkMode={(color: string) => {
            if (!editor.selection) return;
            if (!isBlockActive(editor, 'markerColor', 'type')) return;

            Transforms.setNodes(
              editor,
              {
                colorDarkMode: color,
              },
              { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerColor' }
            );
          }}
          removeColor={() => {
            if (!editor.selection) return;
            Transforms.unwrapNodes(editor, {
              match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'markerColor',
            });
            // Editor.removeMark(editor, format);
            // Editor.removeMark(editor, 'underlineDarkMode');
            // Editor.removeMark(editor, 'timeStamp');
            // Editor.removeMark(editor, 'sync');
            // Editor.removeMark(editor, 'animate');
          }}
        />
      </div>
    </div>
  );
};

export const TextMarkButton = ({ children }: { children: React.ReactNode }) => {
  const defaultSize = useRef(16);
  const defaultFamily = useRef('Varela_Round');
  const defaultSpacing = useRef(0);
  const editor = useSlate();
  const ref = useRef<any>();
  const ref2 = useRef<any>();
  const mark = Editor.marks(editor) || {};
  const [fontSize, setFontSize] = useState(mark.fontSize || defaultSize.current);
  const [fontSpacing, setFontSpacing] = useState(mark.fontSpacing || defaultSpacing.current);
  const [fontFamily, setFontFamily] = useState(mark.fontFamily || defaultFamily.current);

  useEffect(() => {
    setFontSize(mark.fontSize || defaultSize.current);
    setFontSpacing(mark.fontSpacing || defaultSpacing.current);
    setFontFamily(mark.fontFamily || defaultFamily.current);
  }, [mark.fontSize, mark.fontSpacing, mark.fontFamily]);

  const [showSelection, setShowSelection] = useState(false);
  return (
    <div
      title={'Font'}
      className={
        (isMarkActive(editor, 'fontSize') || isMarkActive(editor, 'fontFamily')
          ? `border-b-2 border-black dark:border-light-mint `
          : 'border-b-2 border-light-mint dark:border-primary-dark-gray ') +
        ' relative cursor-pointer [&:hover>div]:block'
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <div className="flex cursor-context-menu flex-col gap-3 rounded-md border-2 border-primary-dark-gray bg-white p-3 dark:bg-primary-dark-gray">
          <div className="flex gap-3">
            <div className="flex cursor-pointer items-center justify-center gap-2 p-2">
              <p>Font Size: </p>

              <input
                onClick={() => ref.current && ref.current.focus()}
                ref={ref}
                type="number"
                step="1"
                min="0"
                className="w-[50px] border-b-2 border-primary-dark-gray pl-2 text-sm tracking-wide text-primary-dark-gray outline-none dark:bg-highlight-dark dark:text-background-light-gray [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:hidden [&::-webkit-outer-spin-button]:[-webkit-appearance:none]"
                id="ColorChooserTimeStamp"
                value={fontSize}
                onChange={(e) => {
                  if (!editor.selection) return;
                  Editor.addMark(editor, 'fontSize', Number(e.target.value));
                  setFontSize(Number(e.target.value));
                }}
              />
            </div>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => {
                  if (ref.current) {
                    if (!editor.selection) return;
                    Editor.addMark(editor, 'fontSize', Number(ref.current.value) + 1);
                    setFontSize(Number(ref.current.value) + 1);
                  }
                }}
                className="p-1"
              >
                <ArrowUp size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref.current && Number(ref.current.value) > 0) {
                    if (!editor.selection) return;
                    Editor.addMark(editor, 'fontSize', Number(ref.current.value) - 1);
                    setFontSize(Number(ref.current.value) - 1);
                  }
                }}
                className="p-1"
              >
                <ArrowDown size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref.current) {
                    if (!editor.selection) return;
                    Editor.addMark(editor, 'fontSize', defaultSize.current);
                    setFontSize(defaultSize.current);
                  }
                }}
                className="p-1"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex cursor-pointer items-center justify-center gap-2 p-2">
              <p>Font Family: </p>
              <div className="relative w-[120px] text-sm tracking-wide underline decoration-wavy underline-offset-4">
                <span onClick={() => setShowSelection(!showSelection)} style={{ fontFamily }} className="px-2">
                  {fontFamily}
                </span>
                {showSelection && (
                  <ul
                    className="absolute left-0 top-[calc(100%+8px)] flex w-[120px] flex-col bg-white text-sm tracking-wide dark:bg-highlight-dark"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <li className="border-l-2 border-r-2 border-t-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (!editor.selection) return;
                          Editor.addMark(editor, 'fontFamily', 'Varela_Round');
                          setFontFamily('Varela_Round');
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: 'Varela_Round' }}
                      >
                        Varela Round
                      </button>
                    </li>
                    <li className="border-l-2 border-r-2 border-t-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (!editor.selection) return;
                          Editor.addMark(editor, 'fontFamily', 'mosk');
                          setFontFamily('mosk');
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: 'mosk' }}
                      >
                        mosk
                      </button>
                    </li>
                    <li className="border-l-2 border-r-2 border-t-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (!editor.selection) return;
                          Editor.addMark(editor, 'fontFamily', 'Consolas');
                          setFontFamily('Consolas');
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: 'Consolas' }}
                      >
                        Consolas
                      </button>
                    </li>
                    <li className="border-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (!editor.selection) return;
                          Editor.addMark(editor, 'fontFamily', 'Cascadia Code');
                          setFontFamily('Cascadia Code');
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: 'Cascadia Code' }}
                      >
                        Cascadia Code
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => {
                  if (!editor.selection) return;
                  Editor.addMark(editor, 'fontFamily', defaultFamily.current);
                  setFontFamily(defaultFamily.current);
                }}
                className="p-1"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex cursor-pointer items-center justify-center gap-2 p-2">
              <p>Font Spacing: </p>

              <input
                onClick={() => ref2.current && ref2.current.focus()}
                ref={ref2}
                type="number"
                step="1"
                min="0"
                className="w-[50px] border-b-2 border-primary-dark-gray pl-2 text-sm tracking-wide text-primary-dark-gray outline-none dark:bg-highlight-dark dark:text-background-light-gray [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:hidden [&::-webkit-outer-spin-button]:[-webkit-appearance:none]"
                id="ColorChooserTimeStamp2"
                value={fontSpacing}
                onChange={(e) => {
                  if (!editor.selection) return;
                  Editor.addMark(editor, 'fontSpacing', Number(e.target.value));
                  setFontSpacing(Number(e.target.value));
                }}
              />
            </div>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => {
                  if (ref2.current) {
                    if (!editor.selection) return;
                    Editor.addMark(editor, 'fontSpacing', Number(ref2.current.value) + 1);
                    setFontSpacing(Number(ref2.current.value) + 1);
                  }
                }}
                className="p-1"
              >
                <ArrowUp size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref2.current && Number(ref2.current.value) > 0) {
                    if (!editor.selection) return;
                    Editor.addMark(editor, 'fontSpacing', Number(ref2.current.value) - 1);
                    setFontSpacing(Number(ref2.current.value) - 1);
                  }
                }}
                className="p-1"
              >
                <ArrowDown size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref2.current) {
                    if (!editor.selection) return;
                    Editor.addMark(editor, 'fontSpacing', defaultSpacing.current);
                    setFontSpacing(defaultSpacing.current);
                  }
                }}
                className="p-1"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const toggleMark = (editor: Editor, format: CustomMarkFormat, value?: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value || true);
  }
};
export const isMarkActive = (editor: Editor, format: CustomMarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? Object.prototype.hasOwnProperty.call(marks, format) : false;
};
