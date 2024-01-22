/** @jsxImportSource react */

import React from "react";
import type { Editor, Element as SlateElement } from "slate";
import { Transforms } from "slate";
import { ReactEditor, useSlateStatic, type RenderElementProps } from "slate-react";

import urlParser from "js-video-url-parser";
import { isUrl } from "~/utils/isUrl";

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

export const EmbedElement = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useSlateStatic();
  const { url } = element;
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
  const [value, setValue] = React.useState(url);
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-lg border-2 border-gray-500" {...attributes}>
      <div contentEditable={false} className="relative">
        <div onClick={() => setOpen(!open)}>
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
          className={
            `absolute left-[50%] top-[100%] z-10 w-[300px] translate-x-[-50%] border-2 border-black ` +
            (open ? "block" : "hidden")
          }
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const newUrl = e.target.value;
            setValue(newUrl);
            const path = ReactEditor.findPath(editor, element);
            const newProperties: Partial<SlateElement> = {
              url: newUrl,
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
