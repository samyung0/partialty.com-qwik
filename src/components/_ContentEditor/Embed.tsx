/** @jsxImportSource react */

import { Editor, Element as SlateElement, Transforms } from 'slate';
import { ReactEditor, useSlateStatic, type RenderElementProps } from 'slate-react';

import urlParser from 'js-video-url-parser';
import { isUrl } from '~/utils/isUrl';

import { ArrowLeft, Check, Link2, RotateCcw, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { BaseRange } from 'slate';
import { Range } from 'slate';
import { useFocused, useSlate } from 'slate-react';

import { isBlockActive } from '~/components/_ContentEditor/blockFn';
import type { UrlLink, VideoEmbed } from '~/components/_ContentEditor/types';
import { EMBED_URL } from '~/const';

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const DAILYMOTION_PREFIX = 'https://www.dailymotion.com/embed/video/';
const YOUKU_PREFIX = 'https://player.youku.com/embed/';
const COUB_PREFIX = 'https://coub.com/embed/';

export const withEmbeds = (editor: Editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) => (element.type === 'embed' ? true : isVoid(element));
  return editor;
};

export const HoveringEmbed = ({
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
  const [url, setUrl] = useState('');
  const initialUrl = useRef('');
  const prevSelection = useRef<BaseRange | null>();

  useEffect(() => {
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'embed',
    });
    if (node) {
      setUrl((node[0] as UrlLink).url || '');
      initialUrl.current = (node[0] as UrlLink).url || '';
    }
  }, [isBlockActive(editor, 'embed', 'type')]);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el || !selection) {
      setLinkOpen(false);
      return;
    }

    prevSelection.current = selection;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'embed',
    });
    if (!node) {
      setLinkOpen(false);
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
      console.log('nah');
      setLinkOpen(false);
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
      {isBlockActive(editor, 'embed', 'type') && (
        <div ref={ref} className="absolute z-[60] shadow-xl" role="group">
          {linkOpen ? (
            <div className="flex flex-col items-stretch rounded-md shadow-sm" role="group">
              <div className="flex gap-4 border-l border-r border-t border-custom-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-inherit dark:border-disabled-dark dark:bg-highlight-dark ">
                <Link2
                  className="invert-[0.8] dark:text-background-light-gray dark:invert-0"
                  strokeWidth={1.5}
                  size={20}
                />
                <input
                  className="bg-light-yellow/50 outline-none dark:bg-highlight-dark"
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
                        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'embed',
                      }
                    );
                    prevSelection.current = null;
                    setLinkOpen(false);
                    ReactEditor.deselect(editor);
                  }}
                  type="button"
                  className="flex flex-1 justify-center border border-custom-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow focus:z-10 dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
                >
                  <Check strokeWidth={2} size={15} />
                </button>
                <button
                  onClick={() => setUrl(initialUrl.current)}
                  type="button"
                  className="flex flex-1 justify-center border-b border-t border-custom-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow focus:z-10 dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
                >
                  <RotateCcw strokeWidth={2} size={15} />
                </button>
                <button
                  onClick={() => setLinkOpen(false)}
                  type="button"
                  className="flex flex-1 justify-center border border-custom-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow focus:z-10 dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
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
                className="rounded-s-lg border border-custom-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow focus:z-10 dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
              >
                Edit Link
              </button>
              <button
                onClick={() => removeEmbed(editor)}
                type="button"
                className="rounded-e-lg border border-custom-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow focus:z-10 dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
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
  let embedType = url ? (url.trim() === '' ? 'Blank' : 'Embed') : 'Blank';
  const parse = urlParser.parse(url || '');
  let parsedUrl = url;

  if (parse && parse.provider && parse.id) {
    embedType = parse.provider
      .split(' ')
      .map((seg) => seg.slice(0, 1).toUpperCase() + seg.slice(1))
      .join(' ');
    switch (parse.provider) {
      case 'youtube':
        parsedUrl = YOUTUBE_PREFIX + parse.id;
        break;
      case 'vimeo':
        parsedUrl = VIMEO_PREFIX + parse.id;
        break;
      case 'dailymotion':
        parsedUrl = DAILYMOTION_PREFIX + parse.id;
        break;
      case 'youku':
        parsedUrl = YOUKU_PREFIX + parse.id;
        break;
      case 'coub':
        parsedUrl = COUB_PREFIX + parse.id;
        break;
      default:
    }
  }

  const shouldDisplay = isUrl(parsedUrl);

  const [value, setValue] = useState(caption || '');
  const ref = useRef<HTMLTextAreaElement>(null);
  const parentRef = useRef<any>();
  const iframeRef = useRef<HTMLDivElement>(null);
  const height = (element as VideoEmbed).embedHeight;

  const darkThemeDivRef = useRef<any>();
  const darkThemeDivInterval = useRef<any>();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, []);
  useEffect(() => {
    parentRef.current = document.getElementById('ParentRefContainer');
    darkThemeDivRef.current = document.getElementById('darkThemeDiv');
    darkThemeDivInterval.current = setInterval(() => {
      const dark = darkThemeDivRef.current.className;
      if (dark === 'dark' && !isDark) {
        setIsDark(true);
      } else if (dark !== 'dark' && isDark) {
        setIsDark(false);
      }
    }, 100);
  }, []);
  useEffect(() => {
    if (iframeRef.current)
      new ResizeObserver((e) => {
        if (parentRef.current && parentRef.current.className.includes('hidden')) return;
        if (iframeRef.current)
          editor.setNodes(
            {
              embedHeight: iframeRef.current.offsetHeight,
            },
            {
              match: (n) => SlateElement.isElement(n) && n.type === 'embed',
              mode: 'highest',
            }
          );
      }).observe(iframeRef.current);
  }, [iframeRef.current]);

  return (
    <div {...attributes}>
      <div className="flex w-full flex-col items-center justify-center gap-2" contentEditable={false}>
        <div className="w-full border-2 border-sea object-contain dark:border-disabled-dark">
          <div className="bg-light-sea p-2 font-mosk text-sm font-bold tracking-wide dark:bg-highlight-dark">
            {embedType}
          </div>
          <div
            style={{ height: `${height}px` }}
            className="aspect-video w-full overflow-hidden [resize:vertical]"
            ref={iframeRef}
          >
            {shouldDisplay && (
              <iframe
                allowTransparency
                allowFullScreen
                className="iframeEmbed size-full"
                src={`${
                  parsedUrl && parsedUrl.startsWith(EMBED_URL) && isDark ? `${parsedUrl}?dark=1` : parsedUrl
                }?title=0&byline=0&portrait=0`}
                frameBorder="0"
              />
            )}
          </div>
        </div>

        <textarea
          ref={ref}
          rows={1}
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

            if (ref.current) {
              ref.current.style.height = 'auto';
              ref.current.style.height = `${e.target.scrollHeight}px`;
            }
          }}
          value={value}
          className="w-full resize-none bg-[unset] p-1 text-center text-sm outline-none placeholder:text-primary-dark-gray/50 dark:placeholder:text-gray-300"
          placeholder={'Enter some captions...'}
        />
      </div>
      {children}
    </div>
  );
};
