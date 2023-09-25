import type { PropFunction } from "@builder.io/qwik";
import { component$, useStore } from "@builder.io/qwik";
import { ChevronDownOutline, ChevronForwardOutline } from "qwik-ionicons";
import type { Entry } from "~/utils/fileUtil";

export const Helper = component$((props: HelperType) => {
  return (
    <>
      <div
        onClick$={() => {
          props.openedFolders.val.includes(props.entry.path)
            ? (props.openedFolders.val = props.openedFolders.val.filter(
                (p) => p !== props.entry.path
              ))
            : (props.openedFolders.val = [...props.openedFolders.val, props.entry.path]);
        }}
        class="flex items-center"
      >
        <div
          class={
            "daisyui-swap daisyui-swap-rotate h-4 w-4 " +
            (props.openedFolders.val.includes(props.entry.path) ? "daisyui-swap-active" : "")
          }
        >
          <ChevronForwardOutline class="daisyui-swap-off w-full fill-current" />
          <ChevronDownOutline class="daisyui-swap-on w-full fill-current" />
        </div>
        <div class="cursor-pointer pl-2">{props.entry.name}</div>
      </div>
      <ul class={"pl-2 " + (props.openedFolders.val.includes(props.entry.path) ? "" : "hidden")}>
        <FolderStructure
          openStagedFile={props.openStagedFile}
          addToStage={props.addToStage}
          entries={props.entry.entries}
          openedFolders={props.openedFolders}
        />
      </ul>
    </>
  );
});

export const FolderStructure = component$((props: FolderStructureProps) => {
  return (
    <>
      {props.entries.map((entry) => {
        return entry.isFolder ? (
          <li class="cursor-pointer" key={entry.path}>
            <Helper
              openStagedFile={props.openStagedFile}
              addToStage={props.addToStage}
              openedFolders={props.openedFolders}
              entry={entry}
            />
          </li>
        ) : (
          <li
            onClick$={async () => {
              /**
               * Handle this differently
               * we can add it this stage, but we shouldnt store
               * a snapshot of the data since the file cannot be edited
               */
              if (entry.isBinary) return;

              props.openStagedFile(entry, await props.addToStage(entry));
            }}
            class="cursor-pointer"
            key={entry.path}
          >
            <div class="flex items-center">
              <div class="h-4 w-4 overflow-hidden"></div>
              <div class="pl-2">{entry.name}</div>
            </div>
          </li>
        );
      })}
    </>
  );
});

export default component$((props: Props) => {
  const openedFolders = useStore<{ val: string[] }>({ val: [] });
  return (
    <FolderStructure
      openStagedFile={props.openStagedFile}
      addToStage={props.addToStage}
      entries={props.entries}
      openedFolders={openedFolders}
    />
  );
});

interface Props {
  entries: Entry[];
  addToStage: PropFunction<(entry: Entry) => any>;
  openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
}

interface FolderStructureProps extends Props {
  openedFolders: { val: string[] };
}

interface HelperType {
  openedFolders: { val: string[] };
  addToStage: PropFunction<(entry: Entry) => any>;
  openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
  entry: Entry;
}
