/** @jsxImportSource react */

import { Eye, NotebookPen } from "lucide-react";

export default ({
  setIsPreviewing,
  isPreviewing,
  hasAudioTrack,
}: {
  setIsPreviewing: (t: boolean) => any;
  isPreviewing: boolean;
  hasAudioTrack: boolean;
}) => {
  return (
    <button
      onClick={() => {
        setIsPreviewing(!isPreviewing);
      }}
      className="absolute right-4 z-[50] flex items-center justify-center rounded-lg bg-primary-dark-gray p-3 text-background-light-gray shadow-xl"
      style={{
        bottom: isPreviewing ? (hasAudioTrack ? "16px" : "calc(10vh + 16px)") : "calc(10vh + 64px)",
      }}
    >
      {isPreviewing ? <NotebookPen size={20} /> : <Eye size={20} />}
    </button>
  );
};
