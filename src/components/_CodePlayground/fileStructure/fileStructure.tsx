import type { PropFunction } from "@builder.io/qwik";
import { component$, useSignal, useStore } from "@builder.io/qwik";
import { FileIcon } from "~/assets/icon/fileIcon";
import { FolderIcon } from "~/assets/icon/folderIcon";
import { RightArrow } from "~/assets/icon/rightArrow";

import { Entry } from "~/utils/fileUtil";

interface EntryInterface {
  entry: Entry;
  level: number; // start from 0 (top level)
  addToStage: PropFunction<(entry: Entry) => any>;
  openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
}

const Entry = component$<EntryInterface>(({ entry, addToStage, openStagedFile, level }) => {
  const isExpanded = useSignal(level > 0 ? false : true);
  const indent = 12 * (level + 1);

  return (
    <>
      {entry.isFolder ? (
        // if the entry is a folder
        <>
          <div
            class={`relative flex cursor-pointer items-center gap-1  hover:bg-dark-down`}
            onClick$={() => (isExpanded.value = !isExpanded.value)}
          >
            <div class="absolute left-0" style={{ paddingLeft: level > 0 ? indent - 12 : 4 }}>
              {isExpanded.value ? (
                <RightArrow width="0.75em" transform="rotate(90)" />
              ) : (
                <RightArrow width="0.75em" />
              )}
            </div>
            <div style={{ paddingLeft: indent }}>{level > 0 && <FolderIcon />}</div>
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
          class={`flex cursor-pointer items-center gap-1 hover:bg-dark-down`}
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
  const selectedEntry = useStore({ level: -1, entryIndex: -1 });

  return (
    <div class="h-full w-[250px] border border-dark bg-black  text-xs text-background-light-gray">
      {entries.map((entry, idx) => (
        <Entry
          key={`entry-${idx}`}
          entry={entry}
          level={0}
          addToStage={addToStage}
          openStagedFile={openStagedFile}
        />
      ))}
    </div>
  );
});
