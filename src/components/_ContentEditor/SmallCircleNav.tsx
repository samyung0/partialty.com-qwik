/** @jsxImportSource react */

import { EllipsisVertical, Eye, Menu, NotebookPen, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useSlateStatic } from 'slate-react';
import serialize from './serialize';

export default ({
  toggleSmallCircleNav,
  openSmallCircleNav,
  toggleSideNav,

  setIsPreviewing,
  setSaveBeforePreview,
  isPreviewing,
  hasAudioTrack,

  hasChanged,
  saveChanges,
  audioTrack,
  chapterName,
  changingValue,
  saveBeforePreview,
  isEditing,
}: {
  toggleSmallCircleNav: () => void;
  openSmallCircleNav: boolean;
  toggleSideNav: () => void;

  setIsPreviewing: (t: boolean) => any;
  setSaveBeforePreview: (t: boolean) => any;
  isPreviewing: boolean;
  hasAudioTrack: boolean;

  hasChanged: boolean;
  saveChanges: (
    contentEditorValue: string | null,
    renderedHTML: string,
    audio_track_playback_id: string | undefined,
    audio_track_asset_id: string | undefined
  ) => Promise<string>;
  audioTrack:
    | {
        id: string;
        duration: number;
        filename: string;
        playback_ids: {
          id: string;
        }[];
      }
    | undefined;
  chapterName: string;
  changingValue: number;
  saveBeforePreview: boolean;
  isEditing: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const eventControl = (event: { type: any }, info: any) => {
    if (event.type === 'mousemove' || event.type === 'touchmove') {
      setIsDragging(true);
    }

    if (event.type === 'mouseup' || event.type === 'touchend') {
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    }
  };

  const editor = useSlateStatic();
  const [isSaving, setIsSaving] = useState(false);
  const autoSave = useRef<any>();
  useEffect(() => {
    clearTimeout(autoSave.current);
    autoSave.current = setTimeout(() => save(), 2000);
  }, [changingValue]);
  useEffect(() => {
    clearTimeout(autoSave.current);
    if (hasChanged) {
      autoSave.current = setTimeout(() => save(), 2000);
    }
  }, [hasChanged]);
  useEffect(() => {
    clearTimeout(autoSave.current);
    if (saveBeforePreview) {
      (async () => {
        await save();
        setSaveBeforePreview(false);
        setIsPreviewing(true);
      })();
    }
  }, [saveBeforePreview]);
  const save = async () => {
    if (!isEditing) return;
    if (!hasChanged || isSaving) return;

    setIsSaving(true);
    const editorContent = editor.children;
    // const heading = `<h1>${chapterName}</h1>`;
    const renderedHTML =
      // heading +
      await serialize(editor.children, true);
    const audio_track_playback_id = audioTrack?.playback_ids[0].id;
    const audio_track_asset_id = audioTrack?.id;
    const isEmpty =
      editorContent.length === 1 &&
      (editorContent[0] as any).type === 'paragraph' &&
      (editorContent[0] as any).children.length === 1 &&
      (editorContent[0] as any).children[0].text === '';
    await saveChanges(
      isEmpty ? null : JSON.stringify(editorContent),
      renderedHTML,
      audio_track_playback_id,
      audio_track_asset_id
    );
    setIsSaving(false);
    clearTimeout(autoSave.current);
  };
  return (
    <Draggable onDrag={eventControl} onStop={eventControl} bounds="parent">
      <div className="content block text-background-light-gray xl:hidden">
        <ul id="menu" className={openSmallCircleNav ? 'menuOpened' : ''}>
          <button
            className="menu-button flex items-center justify-center bg-primary-dark-gray text-white dark:bg-highlight-dark"
            onClick={() => {
              if (isDragging) return;
              toggleSmallCircleNav();
            }}
            onTouchEnd={() => {
              if (isDragging) return;
              toggleSmallCircleNav();
            }}
          >
            <Menu size={20} strokeWidth={3} />
          </button>
          {/* <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <ListEnd size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <ListStart size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <HelpCircle size={20} />
              </span>
            </button>
          </li> */}
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            {/* <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <Eye size={20} />
              </span>
            </button> */}

            <button
              onClick={() => {
                if (!isPreviewing) setSaveBeforePreview(true);
                else setIsPreviewing(false);
              }}
              className="z-[50] hidden items-center justify-center rounded-full bg-primary-dark-gray p-3 text-background-light-gray shadow-xl dark:bg-highlight-dark xl:flex"
            >
              {isPreviewing ? <NotebookPen size={20} /> : <Eye size={20} />}
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            <button onClick={toggleSideNav} onTouchEnd={toggleSideNav} className="cursor-pointer">
              <span className="inline-block h-[20px] w-[20px]">
                <EllipsisVertical size={20} />
              </span>
            </button>
          </li>
          <li className="menu-item bg-primary-dark-gray dark:bg-highlight-dark">
            {/* <button>
              <span className="inline-block h-[20px] w-[20px] text-white">
                <Save size={20} />
              </span>
            </button> */}
            <button
              disabled={!hasChanged || isSaving}
              onClick={async () => {
                console.log(editor.children);
                console.log(await serialize(editor.children, true));
                save();
              }}
              className="items-center justify-center rounded-full bg-primary-dark-gray px-4 py-3 text-background-light-gray shadow-xl disabled:bg-gray-300 dark:bg-highlight-dark dark:disabled:bg-gray-300 xl:flex"
            >
              {!isSaving ? (
                <span>
                  <Save size={20} />
                </span>
              ) : (
                <span>
                  <svg
                    aria-hidden="true"
                    className="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </Draggable>
  );
};
