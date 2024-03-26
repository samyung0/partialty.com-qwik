import type { Signal } from '@builder.io/qwik';
import type { TypeWriter } from '~/components/_Index/codeAnimation/TypeWriter';
import animateShow from '~/components/_Index/codeAnimation/animateShow';
import { disappearEasingFunction } from '~/components/_Index/codeAnimation/easingFunctions';
import switchCodeDisplayed from '~/components/_Index/codeAnimation/switchCodeDisplayed';
import type codeBlock from '~/components/_Index/codeBlock';

const animateHide = async (
  typeWriter: TypeWriter,
  codeDisplay: Signal<string>,
  rendered: Record<`${keyof typeof codeBlock}Rendered`, string>,
  timeStamp: number
) => {
  if (typeWriter.disappearStart === 0) {
    typeWriter.disappearStart = timeStamp;
    typeWriter.previousTimeStamp = timeStamp;
  }
  if (
    typeWriter.currentChar < typeWriter.rollbackTo &&
    typeWriter.timeAfterAnimationFinished >= typeWriter.appearDelay
  ) {
    if (typeWriter.rollbackTo === 0) typeWriter.currentChar = 0;
    else typeWriter.currentChar += 1;

    typeWriter.disappearStart = 0;
    typeWriter.previousTimeStamp = 0;
    typeWriter.timeAfterAnimationFinished = 0;
    typeWriter.timeAfterLastChar = 0;
    switchCodeDisplayed(typeWriter, codeDisplay, rendered);
    window.requestAnimationFrame(animateShow.bind(null, typeWriter, codeDisplay, rendered));
    return;
  }
  if (typeWriter.currentChar >= typeWriter.rollbackTo) {
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
        if (typeWriter.displayCode[typeWriter.currentChar] === '\n') typeWriter.currentRow--;
        else typeWriter.revealedCharArr[typeWriter.currentRow]--;
        typeWriter.currentChar--;
        typeWriter.timeAfterLastChar -= interval;
      }
    }
  } else {
    typeWriter.timeAfterAnimationFinished += timeStamp - typeWriter.previousTimeStamp;
  }
  typeWriter.previousTimeStamp = timeStamp;
  window.requestAnimationFrame(animateHide.bind(null, typeWriter, codeDisplay, rendered));
};

export default animateHide;
