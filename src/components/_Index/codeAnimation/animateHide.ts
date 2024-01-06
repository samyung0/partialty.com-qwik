import type { Signal } from "@builder.io/qwik";
import type { TypeWriter } from "~/components/_Index/codeAnimation/TypeWriter";
import animateShow from "~/components/_Index/codeAnimation/animateShow";
import { disappearEasingFunction } from "~/components/_Index/codeAnimation/easingFunctions";
import switchCodeDisplayed from "~/components/_Index/codeAnimation/switchCodeDisplayed";

const animateHide = (
  typeWriter: TypeWriter,
  codeBlock: Signal<Record<string, any>>,
  codeDisplay: Signal<string>,
  timeStamp: number
): void => {
  if (typeWriter.disappearStart === 0) {
    typeWriter.disappearStart = timeStamp;
    typeWriter.previousTimeStamp = timeStamp;
  }
  // console.log(timeStamp - typeWriter.disappearStart);
  if (
    typeWriter.currentChar < 0 &&
    typeWriter.timeAfterAnimationFinished >= typeWriter.appearDelay
  ) {
    typeWriter.currentChar = 0;
    typeWriter.disappearStart = 0;
    typeWriter.previousTimeStamp = 0;
    typeWriter.timeAfterAnimationFinished = 0;
    typeWriter.timeAfterLastChar = 0;
    switchCodeDisplayed(typeWriter, codeBlock, codeDisplay);
    window.requestAnimationFrame(animateShow.bind(null, typeWriter, codeBlock, codeDisplay));
    return;
  }
  if (typeWriter.currentChar >= 0) {
    if (timeStamp - typeWriter.previousTimeStamp < 100) {
      // if the tab is inactive, we will pause the animation
      typeWriter.timeAfterLastChar += timeStamp - typeWriter.previousTimeStamp;
      const ratio = disappearEasingFunction(
        Math.min(timeStamp - typeWriter.disappearStart, typeWriter.disppearDurationUntilFullSpeed) /
          typeWriter.disppearDurationUntilFullSpeed
      );
      const interval =
        typeWriter.largestIntervalBetweenCharDisappear * (1 - ratio) +
        typeWriter.smallestIntervalBetweenCharDisappear * ratio;
      if (typeWriter.timeAfterLastChar > interval) {
        if (typeWriter.displayCode[typeWriter.currentChar] === "\n") typeWriter.currentRow--;
        else typeWriter.revealedCharArr[typeWriter.currentRow]--;
        typeWriter.currentChar--;
        typeWriter.timeAfterLastChar -= interval;
      }
    }
  } else typeWriter.timeAfterAnimationFinished += timeStamp - typeWriter.previousTimeStamp;
  typeWriter.previousTimeStamp = timeStamp;
  window.requestAnimationFrame(animateHide.bind(null, typeWriter, codeBlock, codeDisplay));
};

export default animateHide;
