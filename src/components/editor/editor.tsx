import type { NoSerialize, PropFunction, Signal } from "@builder.io/qwik";
import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { getMonaco, getUri, openFile } from "~/components/editor/monaco";
import FolderStructure from "~/components/folderStructure/folderStructure";
import type { WebContainerInterface } from "~/components/serverInterface/serverInterface";
import { type Entry, type FileStore } from "~/utils/fileUtil";
import type { IStandaloneCodeEditor } from "./monaco";
import { initMonacoEditor, type ICodeEditorViewState } from "./monaco";

export default component$((props: Props) => {
  const hostRef = useSignal<Element>();
  const editorStore = useStore<EditorStore>({
    editor: undefined,
    onChangeSubscription: undefined,
    viewStates: {}, // uses fsPath
    openedFiles: [], // !!! will store a file snapshot
    // openedEntriesModels: Entry
  });

  const __getEntryFromPath$ = {} as any;
  __getEntryFromPath$._getEntryFromPath$ = $(
    async (pathSegment: string[], currentEntry: Entry | FileStore): Promise<Entry | null> => {
      for (let i = 0; i < currentEntry.entries.length; i++) {
        if (currentEntry.entries[i].name === pathSegment[0]) {
          if (
            !currentEntry.entries[i].isFolder &&
            pathSegment.length === 1 &&
            pathSegment[0] === currentEntry.entries[i].name
          )
            return currentEntry.entries[i];
          return await __getEntryFromPath$._getEntryFromPath$(
            pathSegment.slice(1),
            currentEntry.entries[i]
          );
        }
      }
      return null;
    }
  );
  __getEntryFromPath$.getEntryFromPath$ = $(
    (path: string, currentEntry: Entry | FileStore): Promise<Entry | null> =>
      __getEntryFromPath$._getEntryFromPath$(path.split("/").slice(1), currentEntry)
  );
  const getEntryFromPath$: PropFunction<
    (path: string, currentEntry: Entry | FileStore) => Promise<Entry | null>
  > = __getEntryFromPath$.getEntryFromPath$;

  const verifyFileExists$ = $(async (path: string) => {
    // file should be in fileStore
    // Entry should be in opened files
    // file should be in system
    return (
      (await getEntryFromPath$(path, props.fileStore)) !== null &&
      editorStore.openedFiles.filter((entry: Entry) => entry.path === path).length === 1 &&
      (await props.interfaceStore.value?.getFile(path)) !== undefined
    );
  });

  const verifyFileUnchanged = $(async (path: string) => {
    // non binary data file only
    const data = await props.interfaceStore.value?.getSimpleFile(path);
    if (data === undefined) return false;
    // entry.discrepancy already checks
    // we just do a double check by retrieving the file from fs
    return (
      editorStore.openedFiles.filter(
        (entry: Entry) => entry.path === path && entry.data === data && !entry.discrepancy
      ).length === 1
    );
  });

  // should only be called after verifying file exists
  const updateNonBinaryData$ = $(async (path: string, nonBindaryData: string) => {
    // const entry = (await getEntryFromPath$(path, fileStore)) as Entry;
    // if (!entry.isFolder && !entry.isBinary) entry.data = nonBindaryData;
    for (let i = 0; i < editorStore.openedFiles.length; i++) {
      if (
        editorStore.openedFiles[i].path === path &&
        !editorStore.openedFiles[i].isFolder &&
        !editorStore.openedFiles[i].isBinary
      ) {
        editorStore.openedFiles[i].data = nonBindaryData;
        return;
      }
    }
  });

  const closeFile$ = $(async (path: string) => {
    /**
     * WARN USER ABOUT UNSAVED CHANGES IF ANY
     */
    const monaco = await getMonaco();
    const fsPath = getUri(monaco, path).fsPath;
    const viewState = editorStore.viewStates[fsPath];
    if (viewState) delete editorStore.viewStates[fsPath];
    for (let i = 0; i < editorStore.openedFiles.length; i++) {
      if (editorStore.openedFiles[i].path === path) {
        editorStore.openedFiles.splice(i, 1);
        return;
      }
    }
  });

  const openStagedFile = $((entry: Entry, nonBindaryData: string) => {
    /** If the file data in file system is different than the openedFiles one
     * then a file change has occured and we handle it accordingly
     */

    // Do not display binary files such as images/videos
    if (!entry.isBinary && !entry.isFolder) {
      openFile(editorStore, entry.path, nonBindaryData);
    }

    /** When closing file, warn user about any unsaved changes and discard model */
  });

  const saveOpenedFile = $(async () => {
    const currentModel = editorStore.editor?.getModel();
    if (currentModel) {
      const path = currentModel.uri.path;
      // not checking for isBIndary or isFolder again
      // because it is not supposed to be opened
      // const entry = await getEntryFromPath$(path, fileStore);
      // if (!entry) return;
      // if (entry.isBinary) return;

      const nonBinaryData = currentModel.getValue();

      if (!(await verifyFileExists$(path))) {
        console.error("File not found!");
        closeFile$(path);
        editorStore.editor?.setModel(null);
        return;
      }

      // if fileStore is not identical to openedFiles, meaning the original file is changed
      if (!(await verifyFileUnchanged(path))) {
        console.error("A newer version of the file is detected in the system!");
        // user tries to save when the original file is altered
        // !!! needs handling

        return;
      }

      props.onFileSave(path, nonBinaryData);
      updateNonBinaryData$(path, nonBinaryData);
      console.log("updated", editorStore.openedFiles);
      // viewState data (if any) is now identical to fileStore and fileSnapshot
    }
  });

  const addToStage = $(async (entry: Entry) => {
    // for now, only file with non binary data can be open
    try {
      const data = await props.interfaceStore.value?.getSimpleFile(entry.path);
      if (data === undefined) return null;
      if (editorStore.openedFiles.filter((e) => e.path === entry.path).length === 0)
        editorStore.openedFiles.push({ ...entry, data });
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  });

  /**
   * Remove this
   */
  // useTask$(() => {
  // fileStore.entries.forEach((entry) => addToStage(entry));
  // });

  useVisibleTask$(async () => {
    if (!editorStore.editor) {
      await initMonacoEditor(
        hostRef.value,
        editorStore,
        "File Input",
        $((path: string | undefined, code: string) => {
          // console.log(path, code);
        })
      );
    }
    return () => {
      if (editorStore.editor) {
        editorStore.editor.dispose();
      }
    };
  });

  // useVisibleTask$(({ track }) => {
  //   // track(() => globalStore.theme);
  //   // if (globalStore.theme !== "auto") {
  //   //   store.editor?.updateOptions({
  //   //     theme: getEditorTheme(globalStore.theme === "dark"),
  //   //   });
  //   // }
  //   store.editor?.updateOptions({
  //     theme: getEditorTheme(false),
  //   });
  // });

  // useTask$(async ({ track }) => {
  //   track(() => props.input.version);
  //   track(() => store.editor);

  //   if (props.input.version && store.editor) {
  //     await addQwikLibs(props.input.version);
  //   }
  // });

  // useTask$(async ({ track }) => {
  //   track(() => store.editor);
  //   track(() => props.input.version);
  //   track(() => props.input.files);
  //   track(() => props.store.selectedInputPath);

  //   if (props.input.version && store.editor) {
  //     await updateMonacoEditor(props, store);
  //   }
  // });
  return (
    <>
      <div>
        <Helper openedFiles={editorStore.openedFiles} openStagedFile={openStagedFile} />
        <button class="daisyui-btn" onClick$={saveOpenedFile}>
          Save
        </button>
      </div>
      <div class="flex">
        <div class="p-4">
          <ul>
            <FolderStructure
              addToStage={addToStage}
              openStagedFile={openStagedFile}
              entries={props.fileStore.entries}
            />
          </ul>
        </div>
        <div class={"flex-1 " + props.editorClass} style={props.editorStyle} ref={hostRef} />
      </div>
    </>
  );
});

export const Helper = component$(
  ({
    openedFiles,
    openStagedFile,
  }: {
    openedFiles: Entry[];
    openStagedFile: PropFunction<(entry: Entry, nonBinaryData: string) => any>;
  }) => {
    return (
      <>
        {openedFiles.map((entry) => (
          <button
            class="daisyui-btn"
            key={entry.path}
            onClick$={() => {
              if (!entry.isBinary) openStagedFile(entry, entry.data as string);
            }}
          >
            {entry.name}
          </button>
        ))}
      </>
    );
  }
);

interface Props {
  fileStore: FileStore;
  onFileSave: PropFunction<(path: string, nonBinaryData: string) => any>;
  editorClass?: string;
  editorStyle?: Record<string, string>;
  structureClass?: string;
  structureStyle?: Record<string, string>;
  stagedClass?: string;
  stagedStyle?: Record<string, string>;
  interfaceStore: Signal<NoSerialize<WebContainerInterface> | null>;
}

export interface EditorStore {
  editor: NoSerialize<IStandaloneCodeEditor>;
  // onChangeDebounce: NoSerialize<any>;
  onChangeSubscription: NoSerialize<any>;
  viewStates: Record<string, NoSerialize<ICodeEditorViewState>>;
  openedFiles: Entry[];
}
