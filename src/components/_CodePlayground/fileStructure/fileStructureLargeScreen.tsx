import type { PropFunction } from "@builder.io/qwik";
import { component$, useSignal, useStore } from "@builder.io/qwik";
import { FileIcon } from "~/assets/icon/fileIcon";
import { FolderIcon } from "~/assets/icon/folderIcon";
import { FolderOpenIcon } from "~/assets/icon/folderOpenIcon";
import { RightArrow } from "~/assets/icon/rightArrow";

import type { Entry } from "~/utils/fileUtil";

interface EntryInterface {
  entry: Entry;
  level: number; // start from 1 (top level)
  addToStage: PropFunction<(entry: Entry) => any>;
  openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
}

const Entry = component$<EntryInterface>(({ entry, addToStage, openStagedFile, level }) => {
  const isExpanded = useSignal(true);
  const indent = 4 + 12 * (level + 1);

  return (
    <>
      {entry.isFolder ? (
        // if the entry is a folder
        <>
          <div
            class={`relative flex cursor-pointer items-center gap-1 py-[1px]  hover:bg-dark-down`}
            onClick$={() => (isExpanded.value = !isExpanded.value)}
          >
            <div class="absolute left-0" style={{ paddingLeft: indent - 12 }}>
              {isExpanded.value ? (
                <RightArrow width="0.75em" height="0.75em" transform="rotate(90)" />
              ) : (
                <RightArrow width="0.75em" height="0.75em" />
              )}
            </div>
            <div style={{ paddingLeft: indent }}>
              {isExpanded.value ? <FolderOpenIcon /> : <FolderIcon />}
            </div>
            <span class="">{entry.name}</span>
          </div>
          {/* there are one or more file in a folder */}
          <div class={`${!isExpanded.value && "hidden"}`}>
            {entry.entries.map((entry, idx) => (
              <Entry
                key={`entry-${idx}`}
                entry={entry}
                level={level + 1}
                addToStage={addToStage}
                openStagedFile={openStagedFile}
              />
            ))}
          </div>
        </>
      ) : (
        // if the entry is a file
        <div
          class={`flex cursor-pointer items-center gap-1 py-[1px] hover:bg-dark-down`}
          style={{ paddingLeft: indent }}
          onClick$={async () => {
            if (entry.isBinary) return;

            const nonBinaryData = await addToStage(entry);
            openStagedFile(entry, nonBinaryData);
          }}
        >
          <FileIcon />
          <span>{entry.name}</span>
        </div>
      )}
    </>
  );
});

interface FileStructureInterface {
  entries: Entry[];
  addToStage: PropFunction<(entry: Entry) => any>;
  openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
}

export default component$<FileStructureInterface>(({ entries, addToStage, openStagedFile }) => {
  const projectName = "course-assignment-1";
  const projectExpanded = useSignal(true);
  const selectedEntry = useStore({ level: -1, entryIndex: -1 });

  return (
    <div class="hidden h-full min-w-[200px] border border-dark bg-black pt-1   text-xs text-background-light-gray md:block">
      <div
        class={`relative flex cursor-pointer items-center gap-1 py-1   hover:bg-dark-down`}
        onClick$={() => (projectExpanded.value = !projectExpanded.value)}
      >
        <div class="" style={{ paddingLeft: 8 }}>
          {projectExpanded.value ? (
            <RightArrow width="0.75em" transform="rotate(90)" />
          ) : (
            <RightArrow width="0.75em" />
          )}
        </div>
        <span class="font-bold">{projectName}</span>
      </div>
      <div class={`${!projectExpanded.value && "hidden"}`}>
        {entries.map((entry, idx) => (
          <Entry
            key={`entry-${idx}`}
            entry={entry}
            level={1}
            addToStage={addToStage}
            openStagedFile={openStagedFile}
          />
        ))}
      </div>
    </div>
  );
});
