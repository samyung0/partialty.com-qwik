import type { NoSerialize, PropFunction } from "@builder.io/qwik";
import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { WebContainerInterface } from "~/components/_CodePlayground/serverInterface/serverInterface";
import { type Entry, type FileStore } from "~/utils/fileUtil";
import FileStructure from "../fileStructure/fileStructure";
import FileTab from "./fileTab";
import type { IStandaloneCodeEditor } from "./monaco";
import { getMonaco, getUri, initMonacoEditor, openFile, type ICodeEditorViewState } from "./monaco";

interface EditorInterface {
  fileStore: FileStore;
  saveServerFile: PropFunction<(path: string, nonBinaryData: string) => any>;
  editorClass?: string;
  editorStyle?: Record<string, string>;
  structureClass?: string;
  structureStyle?: Record<string, string>;
  stagedClass?: string;
  stagedStyle?: Record<string, string>;
  serverInterface: {
    server: NoSerialize<WebContainerInterface>;
    booted: boolean;
    ready: boolean;
  };
}

export interface EditorStore {
  editor: NoSerialize<IStandaloneCodeEditor>;
  ready: boolean;
  // onChangeDebounce: NoSerialize<any>;
  onChangeSubscription: NoSerialize<any>;
  viewStates: Record<string, NoSerialize<ICodeEditorViewState>>;
  openedFiles: Entry[];
}

export default component$((props: EditorInterface) => {
  const hostRef = useSignal<Element>();

  const editorStore = useStore<EditorStore>({
    editor: undefined,
    ready: false,
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
    console.log(await getEntryFromPath$(path, props.fileStore));

    return (
      (await getEntryFromPath$(path, props.fileStore)) !== null &&
      editorStore.openedFiles.filter((entry: Entry) => entry.path === path).length === 1 &&
      (await props.serverInterface.server?.readFile(path)) !== undefined
    );
  });

  const verifyFileUnchanged = $(async (path: string) => {
    // non binary data file only
    const data = await props.serverInterface.server?.readSimpleFile(path);
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

  const saveOpenedFiles = $(async () => {
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

      props.saveServerFile(path, nonBinaryData);
      updateNonBinaryData$(path, nonBinaryData);
      console.log("updated", editorStore.openedFiles);
      // viewState data (if any) is now identical to fileStore and fileSnapshot
    }
  });

  const addToStage = $(async (entry: Entry) => {
    try {
      const targetEntry = editorStore.openedFiles.find((e) => e.path === entry.path);

      // if not in display list
      if (!targetEntry) {
        const data = await props.serverInterface.server?.readSimpleFile(entry.path);

        if (data) {
          editorStore.openedFiles.push({ ...entry, data });
          return data;
        }
      }
    } catch (e) {
      console.error(e);

      return null;
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

  /**
   * Remove this
   */
  // useTask$(() => {
  // fileStore.entries.forEach((entry) => addToStage(entry));
  // });

  // useVisibleTask$(async({track}) => {
  //   let editorInput = false
  //   const save = () => {

  //     setTimeout()
  //   };

  //   save();
  // });

  useVisibleTask$(async ({ track }) => {
    track(() => props.serverInterface.ready);
    track(() => props.fileStore.entries.length);

    if (props.serverInterface.ready && props.fileStore.entries.length > 0) {
      // initiate monaco editor
      await initMonacoEditor(
        hostRef.value,
        editorStore,
        "File Input",
        $((path: string | undefined, code: string) => {
          // console.log(path, code);
        })
      );

      const openedEntry = props.fileStore.entries[0];

      const nonBinaryData = await addToStage(openedEntry);
      openStagedFile(openedEntry, nonBinaryData as string);
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
    <div class="flex h-[50%]">
      {/* file structure on the right side */}
      <FileStructure
        entries={props.fileStore.entries}
        addToStage={addToStage}
        openStagedFile={openStagedFile}
      />

      <div class="flex h-full flex-1 flex-col ">
        {/* editor and display */}

        <FileTab
          openedFiles={editorStore.openedFiles}
          openStagedFile={openStagedFile}
          saveOpenedFiles={saveOpenedFiles}
        />
        <div class="flex-1 " style={props.editorStyle} ref={hostRef} />
      </div>
    </div>
  );
});
