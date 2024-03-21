import type { PropFunction } from "@builder.io/qwik";
import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { CrossIcon } from "~/assets/icon/crossIcon";
import { FileIcon } from "~/assets/icon/fileIcon";
import { MenuIcon } from "~/assets/icon/menuIcon";
import { SaveIcon } from "~/assets/icon/saveIcon";
import type { Entry } from "~/utils/fileUtil";
import FileStructureSmallScreen from "../fileStructure/fileStructureSmallScreen";

interface FileTab {
  entries: Entry[];
  openedFiles: Entry[];
  addToStage: PropFunction<(entry: Entry) => any>;
  openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
  saveOpenedFiles: PropFunction<() => any>;
}

export default component$<FileTab>(
  ({ entries, openedFiles, addToStage, openStagedFile, saveOpenedFiles }) => {
    useVisibleTask$(() => {
      // toggle button for the file structure
      const toggleButton = document.getElementById("file-structure-toggle");
      const fileStructure = document.getElementById("file-structure");

      toggleButton?.addEventListener("click", (e) => {
        fileStructure?.classList.toggle("drawer-open");
      });

      document.addEventListener("click", (event) => {
        const targetElement = event.target;
        if (
          !fileStructure?.contains(targetElement as Node) &&
          !toggleButton?.contains(targetElement as Node)
        ) {
          fileStructure?.classList.add("drawer-open");
        }
      });
    });

    return (
      <div class="z-20">
        <div class="relative -z-10 flex h-[35px] items-center justify-between border-y border-r border-dark bg-black  text-xs text-background-light-gray">
          <div class=" flex h-full items-center overflow-auto">
            {/* toggle file structure in smaller screen */}
            <div class=" block h-full border-r border-dark   p-1 md:hidden">
              <div
                id="file-structure-toggle"
                class="inline-block rounded-lg transition-transform duration-500 "
              >
                <MenuIcon width={25} height={25} />
              </div>
            </div>
            {/* files which is opened */}
            <div class="  flex h-full overflow-x-auto">
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
                  <span class="whitespace-nowrap">{file.name}</span>
                  {/* user can remove the opened files */}
                  <div
                    class=" rounded-sm  opacity-0 hover:bg-highlight-dark group-hover:opacity-100"
                    onClick$={() => {}}
                  >
                    <CrossIcon />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="rounded-md p-1  hover:bg-dark" onClick$={() => saveOpenedFiles()}>
            <SaveIcon width="1.25em" height="1.25em" color="#f7f7f7" />
          </div>
        </div>
        <div
          id="file-structure"
          class="fixed left-0 top-[34px] -z-20 w-full  bg-white shadow-lg  transition-all duration-500 peer-checked:translate-y-0 md:hidden "
        >
          <FileStructureSmallScreen
            entries={entries}
            addToStage={addToStage}
            openStagedFile={openStagedFile}
          />
        </div>
      </div>
    );
  }
);
