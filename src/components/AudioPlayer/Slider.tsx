/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import clsx from "clsx";
import { useRef } from "react";
import { mergeProps, useFocusRing, useSlider, useSliderThumb, VisuallyHidden } from "react-aria";
import { useSliderState, type SliderState, type SliderStateOptions } from "react-stately";

function parseTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;
  return [hours, minutes, Math.round(seconds)];
}

function formatTime(seconds: Array<number>, totalSeconds = seconds) {
  const totalWithoutLeadingZeroes = totalSeconds.slice(totalSeconds.findIndex((x) => x !== 0));
  return seconds
    .slice(seconds.length - totalWithoutLeadingZeroes.length)
    .map((x) => x.toString().padStart(2, "0"))
    .join(":");
}

function formatHumanTime(seconds: number) {
  const [h, m, s] = parseTime(seconds);
  return `${h} hour${h === 1 ? "" : "s"}, ${m} minute${m === 1 ? "" : "s"}, ${s} second${
    s === 1 ? "" : "s"
  }`;
}

function Thumb(props: {
  index: number;
  state: SliderState;
  trackRef: React.RefObject<React.ElementRef<"div">>;
  isFocusVisible: boolean;
  focusProps: ReturnType<typeof useFocusRing>["focusProps"];
  onChangeStart?: () => void;
}) {
  const { state, trackRef, focusProps, isFocusVisible, index } = props;
  const inputRef = useRef<React.ElementRef<"input">>(null);
  const { thumbProps, inputProps } = useSliderThumb({ index, trackRef, inputRef }, state);

  return (
    <div
      className="absolute top-1/2 -translate-x-1/2"
      style={{
        left: `${state.getThumbPercent(index) * 100}%`,
      }}
    >
      <div
        {...thumbProps}
        onMouseDown={(...args) => {
          thumbProps.onMouseDown?.(...args);
          props.onChangeStart?.();
        }}
        onPointerDown={(...args) => {
          thumbProps.onPointerDown?.(...args);
          props.onChangeStart?.();
        }}
        className={clsx(
          "h-4 rounded-full",
          isFocusVisible || state.isThumbDragging(index)
            ? "w-1.5 bg-slate-900 dark:bg-gray-300"
            : "w-1 bg-slate-700 dark:bg-background-light-gray"
        )}
      >
        <VisuallyHidden>
          <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
        </VisuallyHidden>
      </div>
    </div>
  );
}

export function Slider(
  props: Omit<SliderStateOptions<Array<number>> & { onChangeStart?: () => void }, "numberFormatter">
) {
  const trackRef = useRef<React.ElementRef<"div">>(null);
  const state = useSliderState({
    ...props,
    numberFormatter: { format: formatHumanTime } as Intl.NumberFormat,
  });
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(props, state, trackRef);
  const { focusProps, isFocusVisible } = useFocusRing();

  const currentTime = parseTime(state.getThumbValue(0));
  const totalTime = parseTime(state.getThumbMaxValue(0));

  return (
    <div {...groupProps} className="flex items-center gap-6">
      {props.label && (
        <label className="sr-only" {...labelProps}>
          {props.label}
        </label>
      )}
      <div
        {...trackProps}
        onMouseDown={(...args) => {
          trackProps.onMouseDown?.(...args);
          props.onChangeStart?.();
        }}
        onPointerDown={(...args) => {
          trackProps.onPointerDown?.(...args);
          props.onChangeStart?.();
        }}
        ref={trackRef}
        className="relative w-full bg-slate-100 dark:bg-highlight-dark md:rounded-full"
      >
        <div
          className={clsx(
            "h-2 md:rounded-l-xl md:rounded-r-md",
            isFocusVisible || state.isThumbDragging(0)
              ? "bg-slate-900 dark:bg-gray-300"
              : "bg-slate-700 dark:bg-background-light-gray"
          )}
          style={{
            width:
              state.getThumbValue(0) === 0
                ? 0
                : `calc(${state.getThumbPercent(0) * 100}% - ${
                    isFocusVisible || state.isThumbDragging(0) ? "0.3125rem" : "0.25rem"
                  })`,
          }}
        />
        <Thumb
          index={0}
          state={state}
          trackRef={trackRef}
          onChangeStart={props.onChangeStart}
          focusProps={focusProps}
          isFocusVisible={isFocusVisible}
        />
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <output
          {...outputProps}
          aria-live="off"
          className={clsx(
            "hidden rounded-md px-1 py-0.5 font-mono text-sm leading-6 md:block",
            state.getThumbMaxValue(0) === 0 && "opacity-0",
            isFocusVisible || state.isThumbDragging(0)
              ? "bg-slate-100 text-slate-900 dark:bg-highlight-dark dark:text-background-light-gray"
              : "text-slate-500 dark:text-gray-300"
          )}
        >
          {formatTime(currentTime, totalTime)}
        </output>
        <span className="text-sm leading-6 text-slate-300" aria-hidden="true">
          /
        </span>
        <span
          className={clsx(
            "hidden rounded-md px-1 py-0.5 font-mono text-sm leading-6 text-slate-500 dark:text-gray-300 md:block",
            state.getThumbMaxValue(0) === 0 && "opacity-0"
          )}
        >
          {formatTime(totalTime)}
        </span>
      </div>
    </div>
  );
}

export default qwikify$(Slider, { eagerness: "load" });
