/** @jsxImportSource react */
import { useEffect, useRef } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";
import { isMarkActive, toggleMark } from "~/components/_ContentEditor/markFn";
import type { CustomMarkFormat } from "~/components/_ContentEditor/types";

import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react";

export const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.style.display = "none";
      return;
    }

    el.style.display = "flex";

    const domSelection = window.getSelection();
    if (!domSelection) return;
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight - 10}px`;
    el.style.left = `${rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  return (
    <div
      ref={ref}
      className={"border-2-black absolute z-10 hidden gap-2 border-2 bg-white p-2"}
      onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault();
      }}
    >
      <FormatButton format="bold" children={<Bold size={20} />} />
      <FormatButton format="italic" children={<Italic size={20} />} />
      <FormatButton format="underline" children={<Underline size={20} />} />
      <FormatButton format="strikethrough" children={<Strikethrough size={20} />} />
      <FormatButton format="code" children={<Code size={20} />} />
    </div>
  );
};

const FormatButton = ({
  format,
  children,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={
        isMarkActive(editor, format) ? `border-b-2 border-black` : "border-b-2 border-light-mint"
      }
      onClick={() => toggleMark(editor, format)}
    >
      {children}
    </button>
  );
};
