/** @jsxImportSource react */
import { ArrowLeft, Check, ExternalLink, Link2, Link2Off, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BaseRange } from "slate";
import { Editor, Range, Element as SlateElement, Text, Transforms } from "slate";
import { ReactEditor, useFocused, useSlate, type RenderElementProps } from "slate-react";

import { isBlockActive } from "~/components/ContentEditor/blockFn";
import { getWord } from "~/components/ContentEditor/getWord";
import type { UrlLink } from "~/components/ContentEditor/types";
import { isUrl } from "~/utils/isUrl";

export const withLink = (editor: Editor) => {
  const { insertData, insertText, isInline, deleteBackward, insertBreak } = editor;

  editor.isInline = (element) => ["link"].includes(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text.endsWith(" ") && editor.selection && Range.isCollapsed(editor.selection)) {
      if (isBlockActive(editor, "link", "type")) {
        insertText(text);
        return;
      }

      const [currentNode] = Editor.node(editor, editor.selection);
      if (!Text.isText(currentNode)) {
        insertText(text);
        return;
      }

      const wordRange = getWord(editor, editor.selection, {
        directions: "left",
      });

      if (!wordRange) {
        insertText(text);
        return;
      }

      const word = Editor.string(editor, wordRange);

      if (isUrl(word)) {
        const newProperties: SlateElement = {
          url: word,
          type: "link",
          children: [{ text: word }],
        };

        Transforms.unwrapNodes(editor, {
          match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
          split: true,
          at: wordRange,
        });
        const wordRange2 = getWord(editor, editor.selection!, {
          directions: "left",
        });
        Promise.resolve().then(() => {
          Transforms.wrapNodes<SlateElement>(editor, newProperties, {
            // match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
            split: true,
            at: wordRange2,
          });
        });
      }
    }
    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      Promise.resolve().then(() => {
        if (!editor.selection) return;
        const match = Editor.above(editor, {
          match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
          at: Editor.unhangRange(editor, editor.selection),
        });
        const cursorBackward = Editor.after(editor, editor.selection, { unit: "character" });
        const matchAfter = Editor.above(editor, {
          match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
          at: cursorBackward,
        });

        const cursorForward = Editor.before(editor, editor.selection, { unit: "character" });
        const matchBefore = Editor.above(editor, {
          match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
          at: cursorForward,
        });

        if (match) {
          // remove empty
          if (Node.string(match[0]) === "") {
            Transforms.unwrapNodes(editor, {
              match: (n) => SlateElement.isElement(n) && n.type === "link",
            });
            return;
          }
        }

        // join
        if (matchBefore && matchAfter) {
          const combinedUrl = Node.string(matchBefore[0]) + Node.string(matchAfter[0]);
          Transforms.removeNodes(editor);
          Transforms.insertNodes(
            editor,
            {
              type: "paragraph",
              children: [
                {
                  text: "",
                },
                {
                  type: "link",
                  url: combinedUrl,
                  children: [{ text: combinedUrl }],
                },
                { text: "" },
              ],
            },
            { at: editor.selection }
          );
          Transforms.select(editor, {
            focus: cursorForward!,
            anchor: cursorForward!,
          });
        }
      });
    }
    deleteBackward(...args);
  };

  editor.insertBreak = (...args) => {
    Promise.resolve().then(() => {
      if (isBlockActive(editor, "link", "type")) {
        if (editor.selection) {
          // delete below blank lines
          {
            const block = Editor.above(editor, {
              match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const end = Editor.end(editor, path);
            const w1 = Editor.string(editor, { anchor: editor.selection.anchor, focus: start });
            const w2 = Editor.string(editor, { anchor: editor.selection.anchor, focus: end });
            if (w1 === "" && w2 === "") {
              Transforms.unwrapNodes(editor);
              Transforms.insertNodes(editor, {
                type: "paragraph",
                children: [{ text: "" }],
              });
            }
          }
          // delete above blank lines
          {
            const cursor = Editor.before(editor, editor.selection, { unit: "character" });
            const block = Editor.above(editor, {
              match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
              at: cursor,
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const end = Editor.end(editor, path);
            const w1 = Editor.string(editor, { anchor: editor.selection.anchor, focus: start });
            const w2 = Editor.string(editor, { anchor: editor.selection.anchor, focus: end });
            if (w1 === "" && w2 === "") {
              const cursor2 = Editor.before(editor, cursor!, { unit: "character" });
              // idk how this works, but it just does
              Transforms.unwrapNodes(editor, { at: cursor });
              Transforms.insertNodes(
                editor,
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
                { at: cursor2 }
              );
              Transforms.unwrapNodes(editor, { at: cursor2 });
            }
          }
        }
      }
    });
    insertBreak(...args);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
      Transforms.move(editor, {
        distance: 1,
        unit: "character",
      });
      Transforms.move(editor, {
        distance: 1,
        unit: "character",
        reverse: true,
      });
    } else {
      insertData(data);
    }
  };

  return editor;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

const wrapLink = (editor: Editor, url: string) => {
  if (isBlockActive(editor, "link", "type")) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: UrlLink = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const HoveringLink = ({
  parentRef,
  offsetX = 0,
  offsetY = 10,
}: {
  parentRef: React.MutableRefObject<any>;
  offsetX?: number;
  offsetY?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const initialUrl = useRef("");
  const prevSelection = useRef<BaseRange | null>();

  useEffect(() => {
    if (!editor.selection) return;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
      at: { anchor: editor.selection.anchor, focus: editor.selection.anchor },
    });
    if (node) {
      setUrl((node[0] as UrlLink).url || "");
      initialUrl.current = (node[0] as UrlLink).url || "";
    }
  }, [isBlockActive(editor, "link", "type")]);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el || !selection) {
      if (el && !selection) el.style.display = "none";
      setLinkOpen(false);
      return;
    }

    prevSelection.current = selection;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
    });
    if (!node) {
      el.style.display = "none";
      setLinkOpen(false);
      return;
    }
    const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);

    let parentNodeX: number = 0;
    if (parentRef.current) parentNodeX = parentRef.current.getBoundingClientRect().x;

    const {
      x: nodeX,
      height: nodeHeight,
      y: _nodeY,
      width: nodeWidth,
    } = linkDOMNode.getBoundingClientRect();

    const nodeY = _nodeY + document.documentElement.scrollTop;

    if (
      (!inFocus &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (prevSelection.current === undefined || prevSelection.current === null)) ||
      !Range.isCollapsed(selection)
    ) {
      setLinkOpen(false);
      el.style.display = "none";
      return;
    }

    el.style.display = "flex";
    el.style.top = `${nodeY + nodeHeight + offsetY}px`;
    el.style.left = `${nodeX + nodeWidth / 2 + offsetX - parentNodeX}px`;
    el.style.transform = "translateX(-50%)";
  });

  return (
    <>
      {isBlockActive(editor, "link", "type") && (
        <div ref={ref} className="absolute z-[60] bg-light-yellow/50 shadow-xl" role="group">
          {linkOpen ? (
            <div className="flex flex-col items-stretch rounded-md shadow-sm" role="group">
              <div className="flex gap-4 border-l border-r border-t border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900">
                <Link2 className="invert-[0.8]" strokeWidth={1.5} size={20} />
                <input
                  className="bg-light-yellow/50 outline-none"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="flex">
                <button
                  onClick={() => {
                    Transforms.setNodes<SlateElement>(
                      editor,
                      {
                        url: url,
                      },
                      {
                        match: (n) =>
                          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
                      }
                    );
                    prevSelection.current = null;
                    setLinkOpen(false);
                    ReactEditor.deselect(editor);
                  }}
                  type="button"
                  className="flex flex-1 justify-center border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
                >
                  <Check strokeWidth={2} size={15} />
                </button>
                <button
                  onClick={() => setUrl(initialUrl.current)}
                  type="button"
                  className="flex flex-1 justify-center border-b border-t border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
                >
                  <RotateCcw strokeWidth={2} size={15} />
                </button>
                <button
                  onClick={() => setLinkOpen(false)}
                  type="button"
                  className="flex flex-1 justify-center border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
                >
                  <ArrowLeft strokeWidth={2} size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="inline-flex rounded-md" role="group">
              <button
                onClick={() => setLinkOpen(true)}
                type="button"
                className="rounded-s-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
              >
                Edit Link
              </button>
              <button
                onClick={() => window.open(initialUrl.current)}
                type="button"
                className="border-b border-t border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
              >
                <ExternalLink strokeWidth={1.5} size={20} />
              </button>
              <button
                onClick={() => toggleLinkAtSelection(editor)}
                type="button"
                className="rounded-e-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
              >
                <Link2Off strokeWidth={1.5} size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

import { Node } from "slate";

export function toggleLinkAtSelection(editor: Editor) {
  if (!isBlockActive(editor, "link", "type")) {
    const isSelectionCollapsed = editor.selection ? Range.isCollapsed(editor.selection) : true;
    if (!isSelectionCollapsed && editor.selection) {
      const pNode = Editor.above(editor);
      let url: string = "#";
      if (pNode) {
        url = Editor.string(editor, editor.selection);
      }
      Transforms.wrapNodes(
        editor,
        { type: "link", url, children: [{ text: "" }] },
        {
          split: true,
          at: editor.selection,
        }
      );
    }
  } else {
    Transforms.unwrapNodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "link",
    });
  }
}

export const LinkElement = ({ attributes, children, element }: RenderElementProps) => {
  return (
    <a {...attributes} href={element.url}>
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

const InlineChromiumBugfix = () => (
  <span contentEditable={false} className="text-[0]">
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);
