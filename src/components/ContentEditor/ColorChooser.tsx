/** @jsxImportSource react */

import { useState } from "react";

export const PredefinedColorList = {
  yellow: "#fcd34d",
  "light-yellow": "#fef6db",
  mint: "#6fdcbf",
  "light-mint": "#e2f8f2",
  lilac: "#ae8fdb",
  "light-lilac": "#efe9f8",
  sea: "#72cada",
  "light-sea": "#e3f4f8",
  sherbet: "#fef8b4",
  "light-sherbet": "#fffce1",
  pink: "#f7b8c2",
  "light-pink": "#fdf1f3",
  rose: "#dc849b",
  tomato: "#ff6347",
  "bright-yellow": "#ffff43",
  "primary-dark-gray": "#1f2937",
  "background-light-gray": "#f7f7f7",
};

// export const HoveringUnderlineColorChooser = ({
//   offsetX = 0,
//   offsetY = 10,
// }: {
//   offsetX?: number;
//   offsetY?: number;
// }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const editor = useSlate();
//   const inFocus = useFocused();

//   const prevSelection = useRef<BaseRange | null>();

//   useEffect(() => {
//     const el = ref.current;
//     const { selection } = editor;

//     if (!el || !selection) {
//       if (el && !selection) el.style.display = "none";
//       return;
//     }

//     prevSelection.current = selection;
//     const mark = Editor.marks(editor);
//     if (!mark || !mark.underline) {
//       el.style.display = "none";
//       return;
//     }
//     const _node = Editor.above(editor, {
//       match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
//     });
//     if (!_node) {
//       el.style.display = "none";
//       return;
//     }
//     const node = _node[0].children.filter(
//       (node) => Text.isText(node) && node.underline && node.underline === mark.underline
//     );
//     if (!node[0]) {
//       el.style.display = "none";
//       return;
//     }
//     const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);
//     const {
//       x: nodeX,
//       height: nodeHeight,
//       y: _nodeY,
//       width: nodeWidth,
//     } = linkDOMNode.getBoundingClientRect();

//     const nodeY = _nodeY + document.documentElement.scrollTop;

//     if (
//       (!inFocus &&
//         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//         (prevSelection.current === undefined || prevSelection.current === null)) ||
//       !Range.isCollapsed(selection)
//     ) {
//       el.style.display = "none";
//       return;
//     }

//     el.style.display = "flex";
//     el.style.top = `${nodeY + nodeHeight + offsetY}px`;
//     el.style.left = `${nodeX + nodeWidth / 2 + offsetX}px`;
//     el.style.transform = "translateX(-50%)";
//   });

//   const [openColorChooser, setOpenColorChooser] = useState(false);

//   return (
//     <>
//       {isMarkActive(editor, "underline") && (
//         <div ref={ref} className="absolute z-10 bg-white shadow-xl" role="group">
//           {!openColorChooser ? (
//             <div className="inline-flex rounded-md" role="group">
//               <button
//                 onClick={() => setOpenColorChooser(true)}
//                 type="button"
//                 className="rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
//               >
//                 Edit Underline
//               </button>
//               <button
//                 type="button"
//                 className="rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
//               >
//                 <Trash strokeWidth={1.5} size={20} />
//               </button>
//             </div>
//           ) : (
//             <ColorChooser
//               setColor={(color: string) => {
//                 setOpenColorChooser(false);
//                 const mark = Editor.marks(editor);
//                 if (!mark || !mark.underline || !editor.selection) {
//                   return;
//                 }
//                 let left = Editor.before(editor, editor.selection, { unit: "character" });
//                 while (left) {
//                   Transforms.select(editor, { anchor: left, focus: left });
//                   const mark2 = Editor.marks(editor);
//                   if (mark2 && mark2.underline === mark.underline)
//                     left = Editor.before(editor, left, { unit: "character" });
//                   else break;
//                 }
//                 let right = Editor.after(editor, editor.selection, { unit: "character" });
//                 while (right) {
//                   Transforms.select(editor, { anchor: right, focus: right });
//                   const mark2 = Editor.marks(editor);
//                   if (mark2 && mark2.underline === mark.underline)
//                     right = Editor.after(editor, right, { unit: "character" });
//                   else {
//                     right = Editor.before(editor, right, { unit: "character" });
//                     break;
//                   }
//                 }
//                 const selection = {
//                   anchor: right || Editor.end(editor, []),
//                   focus: left || Editor.start(editor, []),
//                 }
//                 Transforms.select(editor, selection)
//                 Editor.addMark(editor, "underline", color);
//                 Transforms.collapse(editor)
//               }}
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export const HoveringBackgroundColorChooser = ({
//   offsetX = 0,
//   offsetY = 10,
// }: {
//   offsetX?: number;
//   offsetY?: number;
// }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const editor = useSlate();
//   const inFocus = useFocused();

//   const prevSelection = useRef<BaseRange | null>();

//   useEffect(() => {
//     const el = ref.current;
//     const { selection } = editor;

//     if (!el || !selection) {
//       if (el && !selection) el.style.display = "none";
//       return;
//     }

//     prevSelection.current = selection;
//     const mark = Editor.marks(editor);
//     if (!mark || !mark.background) {
//       el.style.display = "none";
//       return;
//     }
//     const _node = Editor.above(editor, {
//       match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
//     });
//     if (!_node) {
//       el.style.display = "none";
//       return;
//     }
//     const node = _node[0].children.filter(
//       (node) => Text.isText(node) && node.background && node.background === mark.background
//     );
//     if (!node[0]) {
//       el.style.display = "none";
//       return;
//     }
//     const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);
//     const {
//       x: nodeX,
//       height: nodeHeight,
//       y: _nodeY,
//       width: nodeWidth,
//     } = linkDOMNode.getBoundingClientRect();

//     const nodeY = _nodeY + document.documentElement.scrollTop;

//     if (
//       (!inFocus &&
//         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//         (prevSelection.current === undefined || prevSelection.current === null)) ||
//       !Range.isCollapsed(selection)
//     ) {
//       el.style.display = "none";
//       return;
//     }

//     el.style.display = "flex";
//     el.style.top = `${nodeY + nodeHeight + offsetY}px`;
//     el.style.left = `${nodeX + nodeWidth / 2 + offsetX}px`;
//     el.style.transform = "translateX(-50%)";
//   });

//   const [openColorChooser, setOpenColorChooser] = useState(false);

//   return (
//     <>
//       {isMarkActive(editor, "background") && (
//         <div ref={ref} className="absolute z-10 bg-white shadow-xl" role="group">
//           {!openColorChooser ? (
//             <div className="inline-flex rounded-md" role="group">
//               <button
//                 onClick={() => setOpenColorChooser(true)}
//                 type="button"
//                 className="rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
//               >
//                 Edit Background
//               </button>
//               <button
//                 type="button"
//                 className="rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
//               >
//                 <Trash strokeWidth={1.5} size={20} />
//               </button>
//             </div>
//           ) : (
//             <ColorChooser
//               setColor={(color: string) => {
//                 setOpenColorChooser(false);
//                 const mark = Editor.marks(editor);
//                 if (!mark || !mark.background || !editor.selection) {
//                   return;
//                 }
//                 let left = Editor.before(editor, editor.selection, { unit: "character" });
//                 while (left) {
//                   Transforms.select(editor, { anchor: left, focus: left });
//                   const mark2 = Editor.marks(editor);
//                   if (mark2 && mark2.background === mark.background)
//                     left = Editor.before(editor, left, { unit: "character" });
//                   else break;
//                 }
//                 let right = Editor.after(editor, editor.selection, { unit: "character" });
//                 while (right) {
//                   Transforms.select(editor, { anchor: right, focus: right });
//                   const mark2 = Editor.marks(editor);
//                   if (mark2 && mark2.background === mark.background)
//                     right = Editor.after(editor, right, { unit: "character" });
//                   else {
//                     right = Editor.before(editor, right, { unit: "character" });
//                     break;
//                   }
//                 }
//                 const selection = {
//                   anchor: right || Editor.end(editor, []),
//                   focus: left || Editor.start(editor, []),
//                 }
//                 Transforms.select(editor, selection)
//                 Editor.addMark(editor, "background", color);
//                 Transforms.collapse(editor)
//               }}
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export const HoveringColorChooser = ({
//   offsetX = 0,
//   offsetY = 10,
// }: {
//   offsetX?: number;
//   offsetY?: number;
// }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const editor = useSlate();
//   const inFocus = useFocused();

//   const prevSelection = useRef<BaseRange | null>();

//   useEffect(() => {
//     const el = ref.current;
//     const { selection } = editor;

//     if (!el || !selection) {
//       if (el && !selection) el.style.display = "none";
//       return;
//     }

//     prevSelection.current = selection;
//     const mark = Editor.marks(editor);
//     if (!mark || (!mark.color && !mark.underline && !mark.background)) {
//       el.style.display = "none";
//       return;
//     }
//     const _node = Editor.above(editor, {
//       match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
//     });
//     if (!_node) {
//       el.style.display = "none";
//       return;
//     }
//     const colorNode = _node[0].children.filter(
//       (node) => Text.isText(node) && node.color && node.color === mark.color
//     );
//     const backgroundNode = _node[0].children.filter(
//       (node) => Text.isText(node) && node.background && node.background === mark.background
//     );
//     const underlineNode = _node[0].children.filter(
//       (node) => Text.isText(node) && node.underline && node.underline === mark.underline
//     );
//     if (!colorNode[0] && !backgroundNode[0] && !underlineNode[0]) {
//       el.style.display = "none";
//       return;
//     }
//     const node =
//     const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);
//     const {
//       x: nodeX,
//       height: nodeHeight,
//       y: _nodeY,
//       width: nodeWidth,
//     } = linkDOMNode.getBoundingClientRect();

//     const nodeY = _nodeY + document.documentElement.scrollTop;

//     if (
//       (!inFocus &&
//         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//         (prevSelection.current === undefined || prevSelection.current === null)) ||
//       !Range.isCollapsed(selection)
//     ) {
//       el.style.display = "none";
//       return;
//     }

//     el.style.display = "flex";
//     el.style.top = `${nodeY + nodeHeight + offsetY}px`;
//     el.style.left = `${nodeX + nodeWidth / 2 + offsetX}px`;
//     el.style.transform = "translateX(-50%)";
//   });

//   const [openColorChooser, setOpenColorChooser] = useState(false);

//   return (
//     <>
//       {isMarkActive(editor, "color") || isMarkActive(editor, "underline") || isMarkActive(editor, "background") && (
//         <div ref={ref} className="absolute z-10 bg-white shadow-xl" role="group">
//           {!openColorChooser ? (
//             <div className="inline-flex rounded-md" role="group">
//               <button
//                 onClick={() => setOpenColorChooser(true)}
//                 type="button"
//                 className="rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
//               >
//                 Edit Color
//               </button>
//               <button
//                 type="button"
//                 className="rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
//               >
//                 <Trash strokeWidth={1.5} size={20} />
//               </button>
//             </div>
//           ) : (
//             <ColorChooser
//               setColor={(color: string) => {
//                 setOpenColorChooser(false);
//                 const mark = Editor.marks(editor);
//                 if (!mark || !mark.color || !editor.selection) {
//                   return;
//                 }
//                 let left = Editor.before(editor, editor.selection, { unit: "character" });
//                 while (left) {
//                   Transforms.select(editor, { anchor: left, focus: left });
//                   const mark2 = Editor.marks(editor);
//                   if (mark2 && mark2.color === mark.color)
//                     left = Editor.before(editor, left, { unit: "character" });
//                   else break;
//                 }
//                 let right = Editor.after(editor, editor.selection, { unit: "character" });
//                 while (right) {
//                   Transforms.select(editor, { anchor: right, focus: right });
//                   const mark2 = Editor.marks(editor);
//                   if (mark2 && mark2.color === mark.color)
//                     right = Editor.after(editor, right, { unit: "character" });
//                   else {
//                     right = Editor.before(editor, right, { unit: "character" });
//                     break;
//                   }
//                 }
//                 const selection = {
//                   anchor: right || Editor.end(editor, []),
//                   focus: left || Editor.start(editor, []),
//                 }
//                 Transforms.select(editor, selection)
//                 Editor.addMark(editor, "color", color);
//                 Transforms.collapse(editor)
//               }}
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// };

const ColorChooser = ({ setColor }: { setColor: (color: string) => any }) => {
  const [showCustomize, setShowCustomize] = useState(false);
  return !showCustomize ? (
    <div className="flex flex-col rounded-md border-2 border-primary-dark-gray bg-white">
      <ul className="grid grid-cols-6 gap-3 p-6">
        {Object.entries(PredefinedColorList).map((color) => (
          <li
            key={`ColorChooser${color[1]}`}
            className="h-[30px] w-[30px] rounded-xl"
            style={{ background: color[1] }}
          >
            <button onClick={() => setColor(color[1])} className="h-full w-full">
              {" "}
            </button>
          </li>
        ))}
      </ul>
      <div className="relative flex items-center px-4">
        <span className="inline-block h-[2px] flex-1 bg-black/10"></span>
        <span className="px-4 tracking-wide">or</span>
        <span className="inline-block h-[2px] flex-1 bg-black/10"></span>
      </div>
      <div className="p-6 text-center">
        <button
          onClick={() => setShowCustomize(true)}
          className="p-1 tracking-wide underline decoration-wavy underline-offset-4"
        >
          Customize
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border-2 border-primary-dark-gray bg-white p-6">
      <div className="flex items-center justify-center gap-3">
        <label className="tracking-wide" htmlFor="underlineColorCustomize">
          Color:
        </label>
        <input
          onChange={(e) => setColor(e.target.value)}
          id="underlineColorCustomize"
          type="color"
        />
      </div>
      <div className="relative flex w-full items-center px-4">
        <span className="block h-[2px] flex-1 bg-black/10"> </span>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowCustomize(false)}
          className="p-1 tracking-wide underline decoration-wavy underline-offset-4"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ColorChooser;
