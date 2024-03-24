/* eslint-disable qwik/jsx-img */
/** @jsxImportSource react */
import imageExtensions from "image-extensions";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Editor, Element as SlateElement, Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { ReactEditor, useSlateStatic } from "slate-react";
import uploadToCloudinary from "~/components/_ContentEditor/uploadToCloudinaryContentEditor";
import {
  CLOUDINARY_MAX_IMG_SIZE,
  CLOUDINARY_MAX_PIXEL_COUNT,
  CLOUDINARY_NAME,
} from "~/const/cloudinary";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import { isUrl } from "~/utils/isUrl";

import { ExternalLink, Trash } from "lucide-react";
import type { BaseRange } from "slate";
import { Range } from "slate";
import { useFocused, useSlate } from "slate-react";

import { isBlockActive } from "~/components/_ContentEditor/blockFn";
import type { ImageElement } from "~/components/_ContentEditor/types";

export const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  return editor;
};

export const HoveringImage = ({
  parentRef,
  setShowImageChooser,
  setReplaceCurrentImage,
  offsetX = 0,
  offsetY = 10,
}: {
  parentRef: React.MutableRefObject<any>;
  setShowImageChooser: React.Dispatch<React.SetStateAction<boolean>>;
  setReplaceCurrentImage: React.Dispatch<React.SetStateAction<boolean>>;
  offsetX?: number;
  offsetY?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  const initialUrl = useRef("");
  const prevSelection = useRef<BaseRange | null>();

  useEffect(() => {
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "image",
    });
    if (node) {
      initialUrl.current = (node[0] as ImageElement).url || "";
    }
  }, [isBlockActive(editor, "image", "type")]);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el || !selection) {
      if (el && !selection) el.style.display = "none";
      return;
    }

    prevSelection.current = selection;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "image",
    });
    if (!node) {
      el.style.display = "none";
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
      el.style.display = "none";
      return;
    }

    el.style.display = "flex";
    el.style.top = `${Math.min(
      nodeY + nodeHeight + offsetY,
      window.innerHeight * 0.9 - el.offsetHeight
    )}px`;
    el.style.left = `${nodeX + nodeWidth / 2 + offsetX - parentNodeX}px`;
    el.style.transform = "translateX(-50%)";
  });

  return (
    <>
      {isBlockActive(editor, "image", "type") && (
        <div ref={ref} className="absolute z-[60] shadow-xl" role="group">
          <div className="inline-flex rounded-md" role="group">
            <button
              onClick={() => {
                setReplaceCurrentImage(true);
                setShowImageChooser(true);
              }}
              type="button"
              className="rounded-s-lg border border-custom-yellow bg-light-yellow px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
            >
              Edit Image
            </button>
            <button
              onClick={() => window.open(initialUrl.current)}
              type="button"
              className="border-b border-t border-custom-yellow bg-light-yellow px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
            >
              <ExternalLink strokeWidth={1.5} size={20} />
            </button>
            <button
              onClick={() => toggleImageAtSelection(editor)}
              type="button"
              className="rounded-e-lg border border-custom-yellow bg-light-yellow px-4 py-2 text-sm font-medium text-inherit hover:bg-custom-yellow dark:border-disabled-dark dark:bg-highlight-dark dark:hover:bg-disabled-dark "
            >
              <Trash strokeWidth={1.5} size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export function toggleImageAtSelection(editor: Editor) {
  Transforms.removeNodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === "image",
  });
}

export const ImageBlock = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useSlateStatic();
  const [value, setValue] = useState(element.caption || "");
  const ref = useRef<HTMLTextAreaElement>(null);

  const parentRef = useRef<any>();
  const imageRef = useRef<HTMLDivElement>(null);
  const height = (element as ImageElement).imageHeight;
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, []);
  useEffect(() => {
    parentRef.current = document.getElementById("ParentRefContainer");
  }, []);
  useEffect(() => {
    if (imageRef.current)
      new ResizeObserver((e) => {
        if (parentRef.current && parentRef.current.className.includes("hidden")) return;
        if (imageRef.current)
          editor.setNodes(
            {
              imageHeight: imageRef.current.offsetHeight,
            },
            {
              match: (n) => SlateElement.isElement(n) && n.type === "image",
              mode: "highest",
            }
          );
      }).observe(imageRef.current);
  }, [imageRef.current]);
  return (
    <div {...attributes}>
      <figure className="flex flex-col items-center justify-center gap-2" contentEditable={false}>
        <div
          style={{ height: `${height}px` }}
          className="overflow-hidden [resize:vertical] flex justify-center items-center"
          ref={imageRef}
        >
          <img
            width={400}
            height={400}
            src={element.url}
            className="max-h-full w-[80%] flex-auto object-contain"
          />
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
              ref.current.style.height = "auto";
              ref.current.style.height = `${e.target.scrollHeight}px`;
            }
          }}
          value={value}
          className="min-h-[1.25rem] w-full resize-none bg-[unset] p-1 text-center text-sm outline-none placeholder:text-primary-dark-gray/50 dark:placeholder:text-gray-300"
          placeholder={"Enter some captions..."}
        />
        {children}
      </figure>
    </div>
  );
};
export const isImageUrl = (url: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  if (!ext) return false;
  return imageExtensions.includes(ext);
};

export const CenterImageChooser = ({
  editor,
  userImages,
  userId,
  setShowImageChooser,
  replaceCurrentImage,
  setReplaceCurrentImage,
}: {
  editor: Editor;
  userImages: [Promise<string>, CloudinaryPublicPic][];
  userId: string;
  setShowImageChooser: React.Dispatch<React.SetStateAction<boolean>>;
  replaceCurrentImage: boolean;
  setReplaceCurrentImage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [resolvedUserImages, setResolvedUserImages] = useState<[string, CloudinaryPublicPic][]>([]);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    (async () => {
      const t = await Promise.allSettled(userImages.map((x) => x[0]));
      const t2 = t.map((res, index) => [res, userImages[index][1]]) as [
        PromiseSettledResult<string>,
        CloudinaryPublicPic,
      ][];
      setResolvedUserImages(
        t2
          .filter((r) => r[0].status === "fulfilled")
          .map((r) => [(r[0] as PromiseFulfilledResult<string>).value, r[1]]) as [
          string,
          CloudinaryPublicPic,
        ][]
      );
    })();
  }, []);
  return (
    <div className="fixed left-0 top-0 z-[999] flex h-[100vh] w-[100vw] items-center justify-center backdrop-blur-sm">
      <div className="relative flex w-[80vw] flex-col items-center justify-center rounded-lg border-2 border-primary-dark-gray bg-light-mint p-8 dark:bg-primary-dark-gray">
        <h2 className="pb-8 font-mosk text-[2rem] font-bold tracking-wider">Select Image</h2>
        <button onClick={() => setShowImageChooser(false)} className="absolute right-8 top-8 p-2">
          <X size={20} />
        </button>
        {resolvedUserImages.length === 0 && (
          <div className="text-lg tracking-wide">
            Uh Oh. It seems like you haven't uploaded any images yet.
          </div>
        )}
        {resolvedUserImages.length > 0 && (
          <div className="mx-auto grid max-h-[60vh] w-full  items-start justify-center gap-6 overflow-auto [grid-template-columns:repeat(auto-fill,220px)] [grid-template-rows:repeat(auto-fit,220px)]">
            {resolvedUserImages.map(([blobUrl, imgData]) => (
              <button
                key={`resolvedUserImages${blobUrl}`}
                className="flex h-[220px] w-[220px] flex-col items-stretch justify-stretch rounded-lg border-2 border-light-mint p-2 hover:border-custom-pink hover:bg-light-pink dark:border-highlight-dark dark:hover:border-disabled-dark dark:hover:bg-highlight-dark"
                onClick={() => {
                  ReactEditor.focus(editor);
                  if (!editor.selection) return;
                  if (replaceCurrentImage) {
                    editor.setNodes(
                      {
                        url: `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${imgData.public_id}`,
                        public_id: imgData.public_id,
                      },
                      {
                        match: (n) =>
                          SlateElement.isElement(n) &&
                          Editor.isBlock(editor, n) &&
                          n.type === "image",
                        mode: "highest",
                      }
                    );
                    ReactEditor.deselect(editor);
                  } else {
                    editor.insertNode(
                      {
                        type: "image",
                        url: `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${imgData.public_id}`,
                        public_id: imgData.public_id,
                        children: [{ text: "" }],
                      },
                      {
                        at: editor.selection,
                      }
                    );
                  }
                  setReplaceCurrentImage(false);
                  setShowImageChooser(false);
                  // ReactEditor.deselect(editor);
                }}
              >
                <img
                  width={220}
                  height={220}
                  className="h-full w-full object-contain object-center"
                  src={blobUrl}
                  key={`CenterImageChooser${blobUrl}`}
                />
              </button>
            ))}
          </div>
        )}
        <div className="pt-8">
          <label htmlFor="uploadImage">
            {!isUploading ? (
              <p className="cursor-pointer text-lg underline decoration-wavy underline-offset-8">
                {resolvedUserImages.length === 0
                  ? "start by uploading an image"
                  : "or upload a new picture"}
              </p>
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
            <input
              onChange={(e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onabort = () => alert("Cannot load image!");
                reader.onerror = () => alert("Cannot load image!");
                reader.onload = () => {
                  if (!reader.result) {
                    alert("Cannot load image!");
                    return;
                  }
                  const img = new Image();
                  img.src = reader.result as string;
                  img.onload = async () => {
                    if (
                      file.size > CLOUDINARY_MAX_IMG_SIZE ||
                      img.width * img.height > CLOUDINARY_MAX_PIXEL_COUNT
                    ) {
                      alert("The picture is too large!");
                      return;
                    }
                    setIsUploading(true);
                    try {
                      const res = (await uploadToCloudinary(
                        reader.result as string,
                        userId
                      )) as CloudinaryPublicPic;
                      console.log("URL", res.secure_url);
                      const blob = await fetch(res.secure_url)
                        .then((res) => res.blob())
                        .then((blob) => URL.createObjectURL(blob));
                      console.log("BLOB", blob);
                      // put the new image at front since we sorted it by created_at desc
                      setResolvedUserImages([[blob, res], ...resolvedUserImages]);
                      setIsUploading(false);
                    } catch (e) {
                      alert(e);
                      setIsUploading(false);
                    }
                  };
                };
              }}
              type="file"
              className="hidden"
              id="uploadImage"
              accept="image/*"
            ></input>
          </label>
        </div>
      </div>
    </div>
  );
};
