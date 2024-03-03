import type { NoSerialize, Signal } from "@builder.io/qwik";
import {
  $,
  component$,
  createContextId,
  noSerialize,
  useContextProvider,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import filesF from "~/__filesTest";
import Editor from "~/components/_CodePlayground/editor/editor";
import { WebContainerInterface } from "~/components/_CodePlayground/serverInterface/serverInterface";
import { type TerminalStore } from "~/components/_CodePlayground/terminal/terminal";
import type { FileStore } from "~/utils/fileUtil";

export const TerminalContext = createContextId<TerminalStore>("docs.terminal-context");
export const DisplayOutputContext = createContextId<Signal<HTMLIFrameElement>>(
  "docs.displayOutput-context"
);

export default component$(() => {
  const interfaceStore = useSignal<NoSerialize<WebContainerInterface> | null>(null);
  const controlStore = useStore({
    interfaceReady: false,
    interfaceBooted: false,
  });

  // !!! file data is not stored in fileStore, it is fetched everytime when opening or saving
  const fileStore = useStore<FileStore>({
    entries: [],
    name: "",
    // root path
    path: "/",
    data: "",
    discrepancy: false,
    isBinary: false,
    isFolder: true,
  });

  const terminalStore = useStore<TerminalStore>({
    fitAddon: null,
    terminal: null,
  });
  useContextProvider(TerminalContext, terminalStore);

  const refIframe = useSignal<HTMLIFrameElement>(); // for displaying user output
  useContextProvider(DisplayOutputContext, refIframe);

  const onPortOpen = $((port: number, type: "open" | "close", url: string) => {
    console.log(port, type, url);
    if (type === "open") {
      if (refIframe.value) refIframe.value.src = url;
    }
  });

  useVisibleTask$(async () => {
    // initiate the interface
    const webContainer = new WebContainerInterface(fileStore);
    await webContainer.init();
    controlStore.interfaceBooted = true;

    // assign the interface
    interfaceStore.value = noSerialize(webContainer);
  });

  useVisibleTask$(async ({ track }) => {
    track(() => terminalStore.terminal);
    track(() => controlStore.interfaceBooted);

    if (controlStore.interfaceReady) return;
    if (controlStore.interfaceBooted && terminalStore.terminal && interfaceStore.value) {
      await interfaceStore.value.relocateTerminal(terminalStore.terminal);
      console.log("Hi");

      await interfaceStore.value.mountFiles(filesF);
      await interfaceStore.value.watchFiles();
      // await interfaceStore.value.loadGithub("samyung0", "Template_react_1");

      interfaceStore.value.onPort(onPortOpen);
      controlStore.interfaceReady = true;
    }
  });

  return (
    <section class="h-screen">
      <Editor
        interfaceStore={interfaceStore}
        onFileSave={$((path: string, data: string) => {
          interfaceStore.value?.writeFile(path, data);
        })}
        fileStore={fileStore}
        editorStyle={{ height: "300px" }}
      />
    </section>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
