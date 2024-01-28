/** @jsxImportSource react */

import { useSlateStatic } from "slate-react";
import serialize from "~/components/ContentEditor/serialize";

export default ({
  hasChanged,
  saveChanges,
}: {
  hasChanged: boolean;
  saveChanges: (contentEditorValue: any, renderedHTML: string) => void;
}) => {
  const editor = useSlateStatic();
  return (
    <button
      disabled={!hasChanged}
      onClick={async () => {
        console.log(editor.children);
        console.log(await serialize({ children: editor.children }));
        // saveChanges(editor.children, )
      }}
      className="absolute bottom-[calc(10vh+16px)] right-4 z-[50] rounded-lg bg-primary-dark-gray px-4 py-3 text-background-light-gray shadow-xl disabled:bg-gray-300"
    >
      Save
    </button>
  );
};
