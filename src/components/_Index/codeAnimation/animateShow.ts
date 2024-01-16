import type { Signal } from "@builder.io/qwik";
import type { TypeWriter } from "~/components/_Index/codeAnimation/TypeWriter";
import animateHide from "~/components/_Index/codeAnimation/animateHide";
import { appearEasingFunction } from "~/components/_Index/codeAnimation/easingFunctions";
import type codeBlock from "~/components/_Index/codeBlock";

const animateShow = (
  typeWriter: TypeWriter,
  codeDisplay: Signal<string>,
  rendered: Record<`${keyof typeof codeBlock}Rendered`, string>,
  timeStamp: number
) => {
  if (typeWriter.appearStart === 0) {
    typeWriter.appearStart = timeStamp;
    typeWriter.previousTimeStamp = timeStamp;
  }

  if (
    typeWriter.currentChar >= typeWriter.totalChar &&
    typeWriter.timeAfterAnimationFinished >= typeWriter.disappearDelay
  ) {
    typeWriter.codeOutputIndex =
      (typeWriter.codeOutputIndex % typeWriter.displayCodeOrder.length) + 1;

    typeWriter.currentChar = typeWriter.totalChar - 1;
    typeWriter.appearStart = 0;
    typeWriter.previousTimeStamp = 0;
    typeWriter.timeAfterAnimationFinished = 0;
    typeWriter.timeAfterLastChar = 0;
    window.requestAnimationFrame(animateHide.bind(null, typeWriter, codeDisplay, rendered));
    return;
  }
  if (typeWriter.currentChar < typeWriter.totalChar) {
    if (timeStamp - typeWriter.previousTimeStamp < 100) {
      // if the tab is inactive, we will pause the animation
      typeWriter.timeAfterLastChar += timeStamp - typeWriter.previousTimeStamp;
      const ratio = appearEasingFunction(
        Math.min(timeStamp - typeWriter.appearStart, typeWriter.appearDurationUntilFullSpeed) /
          typeWriter.appearDurationUntilFullSpeed
      );
      const interval =
        typeWriter.largestIntervalBetweenCharAppear * (1 - ratio) +
        typeWriter.smallestIntervalBetweenCharAppear * ratio;
      if (typeWriter.timeAfterLastChar > interval) {
        if (typeWriter.displayCode[typeWriter.currentChar] === "\n") typeWriter.currentRow++;
        else typeWriter.revealedCharArr[typeWriter.currentRow]++;
        typeWriter.currentChar++;
        typeWriter.timeAfterLastChar -= interval;
      }
    }
  } else typeWriter.timeAfterAnimationFinished += timeStamp - typeWriter.previousTimeStamp;
  typeWriter.previousTimeStamp = timeStamp;
  window.requestAnimationFrame(animateShow.bind(null, typeWriter, codeDisplay, rendered));
};

export default animateShow;
