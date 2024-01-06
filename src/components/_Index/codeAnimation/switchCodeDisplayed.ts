import type { Signal } from "@builder.io/qwik";
import type { TypeWriter } from "~/components/_Index/codeAnimation/TypeWriter";
import displayCodeOrder from "~/components/_Index/codeAnimation/displayCodeOrder";
import codeStrings from "~/components/_Index/codeBlock";

export default (
  typeWriter: TypeWriter,
  codeBlock: Signal<Record<string, any>>,
  codeDisplay: Signal<string>
) => {
  typeWriter.displayIndex = (typeWriter.displayIndex + 1) % displayCodeOrder.length;
  const name = displayCodeOrder[typeWriter.displayIndex];
  typeWriter.displayCode = codeStrings[name];
  typeWriter.blankCharArr = codeBlock.value[`${name}BlankChar`];
  typeWriter.revealedCharArr = Array(codeBlock.value[`${name}BlankChar`].length).fill(0);
  typeWriter.totalChar = typeWriter.displayCode.length;
  codeDisplay.value = codeBlock.value[name];
};
