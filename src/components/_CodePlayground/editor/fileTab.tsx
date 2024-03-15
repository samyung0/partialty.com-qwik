import type { PropFunction } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { CrossIcon } from "~/assets/icon/crossIcon";
import { FileIcon } from "~/assets/icon/fileIcon";
import { SaveIcon } from "~/assets/icon/saveIcon";
import type { Entry } from "~/utils/fileUtil";

interface FileTab {
  openedFiles: Entry[];
  openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
  saveOpenedFiles: PropFunction<() => any>;
}

export default component$<FileTab>(({ openedFiles, openStagedFile, saveOpenedFiles }) => {
  return (
    <div class="flex h-[35px] items-center justify-between border-y border-r border-dark bg-black pr-2 text-xs text-background-light-gray">
      <div class="flex h-full">
        {openedFiles.map((file, idx) => (
          <div
            class={`group flex items-center gap-1 border-r border-dark py-1 pl-2 pr-1 ${
              openedFiles.length - 1 === idx && "border-r"
            }`}
            key={`file-${idx}`}
            onClick$={() => {
              if (!file.isBinary) openStagedFile(file, file.data as string);
            }}
          >
            <div>
              <FileIcon />
            </div>
            <span>{file.name}</span>
            {/* user can remove the opened files */}
            <div
              class="rounded-sm opacity-0 hover:bg-highlight-dark group-hover:opacity-100"
              onClick$={() => {}}
            >
              <CrossIcon />
            </div>
          </div>
        ))}
      </div>
      <div class="rounded-md p-1 hover:bg-dark" onClick$={() => saveOpenedFiles()}>
        <SaveIcon width="1.25em" height="1.25em" color="#f7f7f7" />
      </div>
    </div>
  );
});
