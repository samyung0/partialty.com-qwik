import type { Signal } from "@builder.io/qwik";
import type { TypeWriter } from "~/components/_Index/codeAnimation/TypeWriter";
import displayCodeOrder from "~/components/_Index/codeAnimation/displayCodeOrder";
import codeBlock from "~/components/_Index/codeBlock";
import blankChar from "~/components/_Index/codeBlock/blankChar";

export default async (
  typeWriter: TypeWriter,
  codeDisplay: Signal<string>,
  rendered: Record<`${keyof typeof codeBlock}Rendered`, string>
) => {
  typeWriter.displayIndex = (typeWriter.displayIndex + 1) % displayCodeOrder.length;
  const name = displayCodeOrder[typeWriter.displayIndex];
  typeWriter.displayCode = codeBlock[name];
  typeWriter.blankCharArr = blankChar[`${name}BlankChar`];
  typeWriter.revealedCharArr = Array(blankChar[`${name}BlankChar`].length).fill(0);
  console.log(typeWriter.blankCharArr);
  console.log(typeWriter.revealedCharArr);

  typeWriter.totalChar = typeWriter.displayCode.length;
  codeDisplay.value = rendered[`${name}Rendered`];
};
