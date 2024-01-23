/** @jsxImportSource react */

import { Editor, Element as SlateElement, Transforms } from "slate";
import { ReactEditor, useSlateStatic, type RenderElementProps } from "slate-react";

import urlParser from "js-video-url-parser";
import { isUrl } from "~/utils/isUrl";

import { ArrowLeft, Check, Link2, RotateCcw, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BaseRange } from "slate";
import { Range } from "slate";
import { useFocused, useSlate } from "slate-react";

import { isBlockActive } from "~/components/ContentEditor/blockFn";
import type { UrlLink } from "~/components/ContentEditor/types";

const YOUTUBE_PREFIX = "https://www.youtube.com/embed/";
const VIMEO_PREFIX = "https://player.vimeo.com/video/";
const DAILYMOTION_PREFIX = "https://www.dailymotion.com/embed/video/";
const YOUKU_PREFIX = "https://player.youku.com/embed/";
const COUB_PREFIX = "https://coub.com/embed/";

export const withEmbeds = (editor: Editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) => (element.type === "embed" ? true : isVoid(element));
  return editor;
};

export const HoveringEmbed = ({
  offsetX = 0,
  offsetY = 10,
}: {
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
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "embed",
    });
    if (node) {
      setUrl((node[0] as UrlLink).url || "");
      initialUrl.current = (node[0] as UrlLink).url || "";
    }
  }, [isBlockActive(editor, "embed", "type")]);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el || !selection) {
      setLinkOpen(false);
      return;
    }

    prevSelection.current = selection;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "embed",
    });
    if (!node) {
      setLinkOpen(false);
      return;
    }
    const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);

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
    el.style.left = `${nodeX + nodeWidth / 2 + offsetX}px`;
    el.style.transform = "translateX(-50%)";
  });

  return (
    <>
      {isBlockActive(editor, "embed", "type") && (
        <div ref={ref} className="absolute z-10 bg-white shadow-xl" role="group">
          {linkOpen ? (
            <div className="flex flex-col items-stretch rounded-md shadow-sm" role="group">
              <div className="flex gap-4 border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900">
                <Link2 className="invert-[0.8]" strokeWidth={1.5} size={20} />
                <input
                  className="outline-none"
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
                          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "embed",
                      }
                    );
                    prevSelection.current = null;
                    setLinkOpen(false);
                    ReactEditor.deselect(editor);
                  }}
                  type="button"
                  className="flex flex-1 justify-center border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
                >
                  <Check strokeWidth={2} size={15} />
                </button>
                <button
                  onClick={() => setUrl(initialUrl.current)}
                  type="button"
                  className="flex flex-1 justify-center border-b border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
                >
                  <RotateCcw strokeWidth={2} size={15} />
                </button>
                <button
                  onClick={() => setLinkOpen(false)}
                  type="button"
                  className="flex flex-1 justify-center border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
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
                className="rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
              >
                Edit Link
              </button>
              <button
                onClick={() => removeEmbed(editor)}
                type="button"
                className="rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
              >
                <Trash strokeWidth={1.5} size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const removeEmbed = (editor: Editor) => {
  Transforms.removeNodes(editor);
};

export const EmbedElement = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useSlateStatic();
  const { url, caption } = element;
  let embedType = "blank";
  const parse = urlParser.parse(url || "");
  let parsedUrl = url;

  if (parse && parse.provider && parse.id) {
    embedType = parse.provider;
    switch (parse.provider) {
      case "youtube":
        parsedUrl = YOUTUBE_PREFIX + parse.id;
        break;
      case "vimeo":
        parsedUrl = VIMEO_PREFIX + parse.id;
        break;
      case "dailymotion":
        parsedUrl = DAILYMOTION_PREFIX + parse.id;
        break;
      case "youku":
        parsedUrl = YOUKU_PREFIX + parse.id;
        break;
      case "coub":
        parsedUrl = COUB_PREFIX + parse.id;
        break;
      default:
    }
  }

  const shouldDisplay = isUrl(parsedUrl);

  const [value, setValue] = useState(caption || "");
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div className="mb-2 rounded-lg border-2 border-gray-500">
          <div className="bg-gray-500 text-white">{embedType}</div>
          <div className="aspect-video w-full">
            {shouldDisplay && (
              <iframe
                className="aspect-video w-full"
                src={`${parsedUrl}?title=0&byline=0&portrait=0`}
                frameBorder="0"
              />
            )}
          </div>
        </div>

        <input
          className={"border-2 border-black"}
          value={value}
          placeholder={"Enter embed caption..."}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const caption = e.target.value;
            setValue(caption);
            const path = ReactEditor.findPath(editor, element);
            const newProperties: Partial<SlateElement> = {
              caption,
            };
            Transforms.setNodes<SlateElement>(editor, newProperties, {
              at: path,
            });
          }}
        />
      </div>
      {children}
    </div>
  );
};
