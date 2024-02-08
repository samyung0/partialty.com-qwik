/* eslint-disable qwik/jsx-img */
/** @jsxImportSource react */
import { Trash, X } from "lucide-react";
// import Prism from "prismjs";
// import "prismjs/components/prism-c";
// import "prismjs/components/prism-cpp";
// import "prismjs/components/prism-csharp";
// import "prismjs/components/prism-css";
// import "prismjs/components/prism-go-module";
// import "prismjs/components/prism-java";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-json";
// import "prismjs/components/prism-jsx";
// import "prismjs/components/prism-markdown";
// import "prismjs/components/prism-markup";
// import "prismjs/components/prism-php";
// import "prismjs/components/prism-python";
// import "prismjs/components/prism-ruby";
// import "prismjs/components/prism-rust";
// import "prismjs/components/prism-sql";
// import "prismjs/components/prism-tsx";
// import "prismjs/components/prism-typescript";

export const languageList = [
  "plainText",
  "html",
  "css",
  "tsx",
  "jsx",
  "typescript",
  "javascript",
  "json",
  "markdown",
  "c",
  "cpp",
  "csharp",
  "go",
  "java",
  "php",
  "python",
  "ruby",
  "rust",
  "sql",
] as const;

export const languageListDisplayNames = {
  html: "HTML",
  css: "CSS",
  c: "C",
  cpp: "C++",
  go: "Golang",
  java: "Java",
  javascript: "Javascript",
  jsx: "JSX",
  markdown: "Markdown",
  php: "PHP",
  python: "Python",
  ruby: "Ruby",
  rust: "Rust",
  sql: "SQL",
  tsx: "TSX",
  typescript: "Typescript",
  json: "JSON",
  plainText: "Plain Text",
  csharp: "C#",
} as const;

import { useEffect, useRef, useState } from "react";
import type { BaseRange, NodeEntry } from "slate";
import { Editor, Range, Element as SlateElement, Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { ReactEditor, useFocused, useSlate } from "slate-react";
// import "./prism-one-dark.css";

import { isBlockActive } from "~/components/_ContentEditor/blockFn";

import { useCallback } from "react";
import { Element, Node } from "slate";

import type { HighlighterCore } from "shikiji/core";
import type { CodeBlockElement } from "~/components/_ContentEditor/types";

const CodeBlockType = "codeBlock";
const CodeLineType = "codeLine";

export const CenterCodeBlockSettings = ({
  editor,
  setShowCodeBlockSettings,
}: {
  editor: Editor;
  setShowCodeBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const matching = editor.above({
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "codeBlock",
  });
  if (!matching) return null;
  const codeBlock = matching[0] as CodeBlockElement;
  const [filename, setFileName] = useState(codeBlock.filename || "");
  const [language, setLanguage] = useState(codeBlock.language);
  return (
    <div className="fixed left-0 top-0 z-[999] flex h-[100vh] w-[100vw] items-center justify-center backdrop-blur-sm">
      <div className="relative flex w-[80vw] flex-col items-center justify-center rounded-lg border-2 border-primary-dark-gray bg-light-mint p-8">
        <h2 className="py-8 font-mosk text-[2rem] font-bold tracking-wider">Configure Codeblock</h2>
        <button
          onClick={() => setShowCodeBlockSettings(false)}
          className="absolute right-8 top-8 p-2"
        >
          <X size={20} />
        </button>
        <div>
          <label htmlFor="FileName" className="cursor-pointer text-lg">
            File Name (any)
          </label>
          <div className="pt-1">
            <input
              value={filename}
              onChange={(e) => setFileName(e.target.value)}
              id="FileName"
              name="FileName"
              type="text"
              className={"block w-[300px] rounded-md border-2 border-primary-dark-gray px-3 py-2"}
            />
          </div>
        </div>
        <br />
        <div>
          <label htmlFor="CodeLanguage" className="cursor-pointer text-lg">
            Code Language
          </label>
          <div className="pt-1">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              id="CodeLanguage"
              className={"block w-[300px] rounded-md border-2 border-primary-dark-gray px-3 py-2"}
            >
              {languageList.map((language) => (
                <option key={`codeBlockSettings${language}`} value={language}>
                  {languageListDisplayNames[language]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            editor.setNodes(
              { filename, language },
              {
                match: (n) =>
                  SlateElement.isElement(n) && Editor.isBlock(editor, n) && n.type === "codeBlock",
              }
            );
            setShowCodeBlockSettings(false);
          }}
          className="my-8 inline-block rounded-lg bg-primary-dark-gray px-8 py-4 text-background-light-gray"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export const HoveringCodeBlock = ({
  parentRef,
  setShowCodeBlockSettings,
  offsetX = 0,
  offsetY = 10,
}: {
  parentRef: React.MutableRefObject<any>;
  setShowCodeBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
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
      if (el && !selection) el.style.display = "none";
      return;
    }

    prevSelection.current = selection;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "codeBlock",
    });
    if (!node) {
      el.style.display = "none";
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

    let parentNodeX: number = 0;
    if (parentRef.current) parentNodeX = parentRef.current.getBoundingClientRect().x;

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
    el.style.top = `${nodeY + nodeHeight + offsetY}px`;
    el.style.left = `${nodeX + nodeWidth / 2 + offsetX - parentNodeX}px`;
    el.style.transform = "translateX(-50%)";
  });

  return (
    <>
      {isBlockActive(editor, "codeBlock", "type") && (
        <div
          ref={ref}
          className="absolute z-[60] flex flex-col items-center justify-start bg-light-yellow shadow-xl"
          role="group"
        >
          <div className="inline-flex rounded-md" role="group">
            <button
              onClick={() => setShowCodeBlockSettings(true)}
              type="button"
              className="rounded-s-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
            >
              Settings
            </button>
            <button
              onClick={() => toggleCodeBlockAtSelection(editor)}
              type="button"
              className="rounded-e-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
            >
              <Trash strokeWidth={1.5} size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export function toggleCodeBlockAtSelection(editor: Editor) {
  Transforms.removeNodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === "codeBlock",
  });
}

export const CodeLine = ({ attributes, children, element }: RenderElementProps) => {
  return <div className="leading-7">{children}</div>;
};

export const CodeBlock = ({ attributes, children, element }: RenderElementProps) => {
  const filename = element.filename;
  return (
    <div className={"prismOneDark"}>
      <pre {...attributes} spellCheck={false}>
        {filename && (
          <div contentEditable={false}>
            <p className="m-0">{filename}</p>
            <hr className="m-2  border-gray-400" />
          </div>
        )}
        <code>{children}</code>
      </pre>
    </div>
  );
};

export const useDecorate = (editor: Editor) => {
  return useCallback(
    ([node, path]: NodeEntry) => {
      if (Element.isElement(node) && node.type === CodeLineType && editor.nodeToDecorations) {
        const ranges = editor.nodeToDecorations.get(node) || [];
        return ranges;
      }

      return [];
    },
    [editor.nodeToDecorations]
  );
};

export const SetNodeToDecorations = ({ shikiji }: { shikiji: HighlighterCore }) => {
  const editor = useSlate();

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: "highest",
      match: (n) => Element.isElement(n) && n.type === CodeBlockType,
    })
  ) as NodeEntry<CodeBlockElement>[];

  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations.bind(null, shikiji))
  );

  editor.nodeToDecorations = nodeToDecorations;

  return null;
};

const fontStyleMap = {
  0: {
    fontStyle: "normal",
  },
  1: {
    fontStyle: "italic",
  },
  2: {
    fontWeight: "bold",
  },
  4: {
    textDecoration: "underline",
  },
};

const getChildNodeToDecorations = (
  shikiji: HighlighterCore,
  [block, blockPath]: NodeEntry<CodeBlockElement>
) => {
  const nodeToDecorations = new Map<Element, Range[]>();

  const text = block.children.map((line) => Node.string(line)).join("\n");
  const language = block.language;
  // const tokens = Prism.tokenize(text, Prism.languages[language || "tsx"]);
  // const normalizedTokens = normalizeTokens(tokens);
  const normalizedTokens = shikiji.codeToThemedTokens(text, { lang: language || "tsx" });
  const blockChildren = block.children as Element[];

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index];
    const element = blockChildren[index];

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }

    let start = 0;
    for (const token of tokens) {
      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      let newObj: any = {};
      for (const i in token) {
        if (i !== "content") {
          if (i === "fontStyle")
            newObj = { ...newObj, ...((fontStyleMap as any)[token[i] as any] || {}) };
          else newObj[i] = (token as any)[i];
        }
      }

      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        style: newObj,
      };

      nodeToDecorations.get(element)!.push(range);

      start = end;
    }
  }

  return nodeToDecorations;
};

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>();

  for (const m of maps) {
    for (const item of m) {
      map.set(...item);
    }
  }

  return map;
};
const toChildren = (content: string) => [{ text: content }];
export const toCodeLines = (content: string): Element[] =>
  content.split("\n").map((line) => ({ type: CodeLineType, children: toChildren(line) }));

// export const normalizeTokens = (tokens: Array<PrismToken | string>): Token[][] => {
//   const typeArrStack: string[][] = [[]];
//   const tokenArrStack: any = [tokens];
//   const tokenArrIndexStack = [0];
//   const tokenArrSizeStack = [tokens.length];

//   let i = 0;
//   let stackIndex = 0;
//   let currentLine: any = [];

//   const acc = [currentLine];

//   while (stackIndex > -1) {
//     while ((i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]) {
//       let content;
//       let types = typeArrStack[stackIndex];

//       const tokenArr = tokenArrStack[stackIndex];
//       const token = tokenArr[i];

//       // Determine content and append type to types if necessary
//       if (typeof token === "string") {
//         types = stackIndex > 0 ? types : ["plain"];
//         content = token;
//       } else {
//         types = appendTypes(types, token.type);
//         if (token.alias) {
//           types = appendTypes(types, token.alias);
//         }

//         content = token.content;
//       }

//       // If token.content is an array, increase the stack depth and repeat this while-loop
//       if (typeof content !== "string") {
//         stackIndex++;
//         typeArrStack.push(types);
//         tokenArrStack.push(content);
//         tokenArrIndexStack.push(0);
//         tokenArrSizeStack.push(content.length);
//         continue;
//       }

//       // Split by newlines
//       const splitByNewlines = content.split(newlineRe);
//       const newlineCount = splitByNewlines.length;

//       currentLine.push({ types, content: splitByNewlines[0] });

//       // Create a new line for each string on a new line
//       for (let i = 1; i < newlineCount; i++) {
//         normalizeEmptyLines(currentLine);
//         acc.push((currentLine = []));
//         currentLine.push({ types, content: splitByNewlines[i] });
//       }
//     }

//     // Decreate the stack depth
//     stackIndex--;
//     typeArrStack.pop();
//     tokenArrStack.pop();
//     tokenArrIndexStack.pop();
//     tokenArrSizeStack.pop();
//   }

//   normalizeEmptyLines(currentLine);
//   return acc;
// };

// type PrismToken = Prism.Token;
// type Token = {
//   types: string[];
//   content: string;
//   empty?: boolean;
// };

// const newlineRe = /\r\n|\r|\n/;

// Empty lines need to contain a single empty token, denoted with { empty: true }
// const normalizeEmptyLines = (line: Token[]) => {
//   if (line.length === 0) {
//     line.push({
//       types: ["plain"],
//       content: "\n",
//       empty: true,
//     });
//   } else if (line.length === 1 && line[0].content === "") {
//     line[0].content = "\n";
//     line[0].empty = true;
//   }
// };

// const appendTypes = (types: string[], add: string[] | string): string[] => {
//   const typesSize = types.length;
//   if (typesSize > 0 && types[typesSize - 1] === add) {
//     return types;
//   }

//   return types.concat(add);
// };
