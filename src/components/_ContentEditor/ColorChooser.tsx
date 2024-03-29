/** @jsxImportSource react */

import { ArrowDown, ArrowUp, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const _PredefinedColorList = {
  'bright-sun': {
    '100': '#fef1c7',
    '300': '#fcd34d',
    '500': '#f5be0b',
    '700': '#b48c09',
    '900': '#785f0f',
  },
  bermuda: {
    '100': '#d1f6ea',
    '300': '#6fdcbf',
    '500': '#25a78b',
    '700': '#1a6b5c',
    '900': '#194840',
  },
  'east-side': {
    '100': '#f1edfa',
    '300': '#d1c4ee',
    '500': '#ae8fdb',
    '700': '#7f4eb3',
    '900': '#59377b',
  },
  viking: {
    '100': '#d8f2f5',
    '300': '#72cada',
    '500': '#2c96ae',
    '700': '#266378',
    '900': '#244655',
  },
  pink: {
    '100': '#fde6e9',
    '300': '#f7b8c2',
    '500': '#e54e6d',
    '700': '#b02048',
    '900': '#7e1d3e',
  },
  persimmon: {
    '100': '#ffe4df',
    '300': '#ffac9d',
    '500': '#ff6347',
    '700': '#c8290d',
    '900': '#882614',
  },
  custom: {
    'bright-yellow': '#ffff43',
    'primary-dark-gray': '#1f2937',
    'background-light-gray': '#f7f7f7',
  },
};
const PredefinedColorList = Object.entries(_PredefinedColorList)
  .map(([_, color]) => Object.entries(color).map(([_, color2]) => color2))
  .flat();

const ColorChooser = ({
  setColor,
  setColorDarkMode,
  getTime,
  setSync,
  setTimeStamp,
  setAnimate,
  node,
  canSync = true,
  canAnimate = true,
  removeColor,
}: {
  node: any;
  setColor: (color: string) => any;
  setColorDarkMode: (color: string) => any;
  getTime: () => number;
  setSync: () => void;
  setTimeStamp: (timeStamp: number) => void;
  setAnimate: () => void;
  canSync?: boolean;
  canAnimate?: boolean;
  removeColor: () => void;
}) => {
  const [syncTime, setSyncTime] = useState(!!node.sync);
  const [timeStamp, setTimeStampState] = useState(node.timeStamp || 0);
  const [animate, setAnimateState] = useState(!!node.animate);
  const ref = useRef<any>();
  const refSync = useRef<any>();
  const refAnimate = useRef<any>();
  useEffect(() => {
    setSyncTime(!!node.sync);
    setTimeStampState(node.timeStamp || 0);
    setAnimateState(!!node.animate);
  }, [JSON.stringify(node)]);
  return (
    <div className="flex max-h-[500px] cursor-context-menu flex-col overflow-auto rounded-md border-2 border-primary-dark-gray bg-white dark:border-disabled-dark dark:bg-primary-dark-gray">
      <p className="pl-6 pt-6 text-sm">Light Mode (must choose)</p>
      <ul className="grid grid-cols-5 gap-3 p-6">
        {Object.entries(PredefinedColorList).map((color) => (
          <li
            key={`ColorChooser${color[1]}`}
            className="h-[30px] w-[30px] rounded-xl dark:border-2 dark:border-highlight-dark"
            style={{ background: color[1] }}
          >
            <button onClick={() => setColor(color[1])} className="h-full w-full">
              {' '}
            </button>
          </li>
        ))}
      </ul>
      <p className="pl-6 text-sm">Dark Mode</p>
      <ul className="grid grid-cols-5 gap-3 p-6">
        {Object.entries(PredefinedColorList).map((color) => (
          <li
            key={`ColorChooser${color[1]}`}
            className="h-[30px] w-[30px] rounded-xl dark:border-2 dark:border-highlight-dark"
            style={{ background: color[1] }}
          >
            <button onClick={() => setColorDarkMode(color[1])} className="h-full w-full">
              {' '}
            </button>
          </li>
        ))}
      </ul>
      <div className="relative flex items-center px-4">
        <span className="inline-block h-[2px] flex-1 bg-black/10 dark:bg-background-light-gray"></span>
        <span className="px-4 tracking-wide">or</span>
        <span className="inline-block h-[2px] flex-1 bg-black/10 dark:bg-background-light-gray"></span>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border-primary-dark-gray bg-white p-6 dark:bg-primary-dark-gray">
        <div className="flex items-center justify-center gap-3">
          <label className="tracking-wide" htmlFor="underlineColorCustomize">
            Customize:
          </label>
          <input onChange={(e) => setColor(e.target.value)} id="underlineColorCustomize" type="color" />
        </div>
      </div>
      {canSync && (
        <div className="mb-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2 p-2">
            <input
              ref={refSync}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-dark-gray outline-none"
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
                    className="w-[50px] border-b-2 border-primary-dark-gray pl-2 text-sm tracking-wide text-primary-dark-gray outline-none dark:bg-highlight-dark dark:text-background-light-gray [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:hidden [&::-webkit-outer-spin-button]:[-webkit-appearance:none]"
                    id="ColorChooserTimeStamp3"
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
      )}
      {canAnimate && (
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 p-2">
            <input
              ref={refAnimate}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-dark-gray outline-none"
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
      )}

      <div className="p-4 text-center">
        <button onClick={() => removeColor()} className="p-1">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default ColorChooser;
