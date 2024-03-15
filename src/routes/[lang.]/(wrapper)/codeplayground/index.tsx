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
import playgroundDefaultFiles from "~/__filesTest";
import Editor from "~/components/_CodePlayground/editor/editor";
import { WebContainerInterface } from "~/components/_CodePlayground/serverInterface/serverInterface";
import { type TerminalStore } from "~/components/_CodePlayground/terminal/terminal";
import type { FileStore } from "~/utils/fileUtil";

export const TerminalContext = createContextId<TerminalStore>("docs.terminal-context");
export const DisplayOutputContext = createContextId<Signal<HTMLIFrameElement>>(
  "docs.displayOutput-context"
);

export default component$(() => {
  const serverInterface = useStore<{
    server: NoSerialize<WebContainerInterface>;
    booted: boolean;
    ready: boolean;
  }>({
    server: undefined,
    booted: false,
    ready: false,
  });

  // !!! file data is not stored in fileStore, it is fetched everytime when opening or saving
  const fileStore = useStore<FileStore>({
    name: "",
    path: "/", // root path
    data: "",
    isBinary: false,
    isFolder: true,
    entries: [],
    discrepancy: false,
  });
  const refIframe = useSignal<HTMLIFrameElement>(); // for displaying user output
  useContextProvider(DisplayOutputContext, refIframe);
  const terminalStore = useStore<TerminalStore>({
    fitAddon: null,
    terminal: null,
  });
  useContextProvider(TerminalContext, terminalStore);

  const onPortOpen = $((port: number, type: "open" | "close", url: string) => {
    console.log(port, type, url);
    if (type === "open") {
      console.log("Trigger");

      if (refIframe.value) refIframe.value.src = url;
    }
  });

  const saveServerFile = $((path: string, data: string) => {
    serverInterface.server?.writeFile(path, data);
  });

  useVisibleTask$(async () => {
    // initiate the interface
    const webContainer = new WebContainerInterface(fileStore);
    await webContainer.init();

    // assign the interface
    serverInterface.server = noSerialize(webContainer);
    serverInterface.booted = true;
  });

  useVisibleTask$(async ({ track }) => {
    track(() => terminalStore.terminal);
    track(() => serverInterface.booted);

    if (serverInterface.booted && terminalStore.terminal) {
      await serverInterface.server?.relocateTerminal(terminalStore.terminal);
      await serverInterface.server?.mountFiles(playgroundDefaultFiles);
      await serverInterface.server?.watchFiles();
      // await interfaceStore.value.loadGithub("samyung0", "Template_react_1");

      serverInterface.server?.onPort(onPortOpen);
      serverInterface.ready = true;
      console.log("Server Interface is ready");
    }
  });

  return (
    <section class="h-screen">
      <Editor
        serverInterface={serverInterface}
        saveServerFile={saveServerFile}
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
