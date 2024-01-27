/** @jsxImportSource react */

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const ColorChooser = ({
  setColor,
  getTime,
  setSync,
  setTimeStamp,
  setAnimate,
  mark,
}: {
  mark: any;
  setColor: (color: string) => any;
  getTime: () => number;
  setSync: () => void;
  setTimeStamp: (timeStamp: number) => void;
  setAnimate: () => void;
}) => {
  const [showCustomize, setShowCustomize] = useState(false);
  const [syncTime, setSyncTime] = useState(!!mark.sync);
  const [timeStamp, setTimeStampState] = useState(mark.timeStamp || 0);
  const [animate, setAnimateState] = useState(!!mark.animate);
  const ref = useRef<any>();
  const refSync = useRef<any>();
  const refAnimate = useRef<any>();
  useEffect(() => {
    setSyncTime(!!mark.sync);
    setTimeStampState(mark.timeStamp || 0);
    setAnimateState(!!mark.animate);
  }, [JSON.stringify(mark)]);
  return !showCustomize ? (
    <div className="flex cursor-context-menu flex-col rounded-md border-2 border-primary-dark-gray bg-white">
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
      <div className="mb-4 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2 p-2">
          <input
            ref={refSync}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-dark-gray outline-none"
            id="ColorChooserSync"
            checked={syncTime}
            onChange={(e) => {
              setSyncTime(e.target.checked);
              setTimeStamp(Math.round(getTime()));
              setTimeStampState(Math.round(getTime()));
              setSync();
            }}
          />
          <p
            className="cursor-pointer"
            onClick={() => {
              if (refSync.current) {
                setSyncTime(!refSync.current.checked);
                setTimeStamp(Math.round(getTime()));
                setTimeStampState(Math.round(getTime()));
                setSync();
                refSync.current.checked = !refSync.current.checked;
              }
            }}
          >
            Sync with Time
          </p>
        </div>
        {syncTime && (
          <>
            <div className="flex gap-3">
              <div className="flex cursor-pointer items-center justify-center gap-2 p-2">
                <p>Time: </p>

                <input
                  onClick={() => ref.current && ref.current.focus()}
                  ref={ref}
                  type="number"
                  step="1"
                  min="0"
                  className="w-[50px] border-b-2 border-primary-dark-gray pl-2 text-sm tracking-wide text-primary-dark-gray outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:hidden [&::-webkit-outer-spin-button]:[-webkit-appearance:none]"
                  id="ColorChooserTimeStamp"
                  value={timeStamp}
                  onChange={(e) => {
                    setTimeStampState(Number(e.target.value));
                    setTimeStamp(Number(e.target.value));
                  }}
                />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    if (ref.current) {
                      setTimeStampState(Number(ref.current.value) + 1);
                      setTimeStamp(Number(ref.current.value) + 1);
                    }
                  }}
                  className="p-1"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  onClick={() => {
                    if (ref.current && Number(ref.current.value) > 0) {
                      setTimeStampState(Number(ref.current.value) - 1);
                      setTimeStamp(Number(ref.current.value) - 1);
                    }
                  }}
                  className="p-1"
                >
                  <ArrowDown size={15} />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setTimeStampState(Math.round(getTime()));
                setTimeStamp(Math.round(getTime()));
              }}
              className="ml-4 p-1 text-sm tracking-wide underline decoration-wavy underline-offset-4"
            >
              Current Time
            </button>
          </>
        )}
      </div>
      <div className="mb-4 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 p-2">
          <input
            ref={refAnimate}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-dark-gray outline-none"
            id="ColorChooserAnimate"
            checked={animate}
            onChange={(e) => {
              setAnimate();
              setAnimateState(e.target.checked);
            }}
          />
          <p
            className="cursor-pointer"
            onClick={() => {
              if (refAnimate.current) {
                refAnimate.current.checked = !refAnimate.current.checked;
                setAnimate();
              }
            }}
          >
            Animate
          </p>
        </div>
      </div>
      <div className="relative flex items-center px-4">
        <span className="inline-block h-[2px] flex-1 bg-black/10"></span>
        <span className="px-4 tracking-wide">or</span>
        <span className="inline-block h-[2px] flex-1 bg-black/10"></span>
      </div>
      <div className="p-4 text-center">
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
