import type { NoSerialize } from "@builder.io/qwik";
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
import { RefreshIcon } from "~/assets/icon/refreshIcon";
import { TerminalIcon } from "~/assets/icon/terminalIcon";
import Editor from "~/components/_CodePlayground/editor/editor";
import { WebContainerInterface } from "~/components/_CodePlayground/serverInterface/serverInterface";
import Terminal, { type TerminalStore } from "~/components/_CodePlayground/terminal/terminal";
import type { FileStore } from "~/utils/fileUtil";

export const TerminalContext = createContextId<TerminalStore>("docs.terminal-context");

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

  const displayBaseUrl = useSignal("");
  const route = useSignal("/");
  const displayRef = useSignal<HTMLIFrameElement>(); // for displaying user output
  const terminalStore = useStore<TerminalStore>({
    fitAddon: null,
    terminal: null,
  });
  useContextProvider(TerminalContext, terminalStore);

  const onPortOpen = $((port: number, type: "open" | "close", url: string) => {
    console.log(port, type, url);
    if (type === "open") {
      if (displayRef.value) {
        displayBaseUrl.value = url;

        // set display screen
        displayRef.value.src = url;
      }
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
    <section class="flex h-screen flex-col">
      <Editor
        serverInterface={serverInterface}
        saveServerFile={saveServerFile}
        fileStore={fileStore}
        editorStyle={{ height: "200px" }}
      />
      <div class="flex flex-col">
        {/* control set */}
        <div class="flex items-center border-b border-black">
          {/* refresh button */}
          <div class="m-2 rounded-lg hover:bg-dark/10">
            <RefreshIcon width={25} height={25} />
          </div>
          {/* input field for entering url */}
          <input
            value={route.value}
            class="my-1 h-[25px] w-full rounded-full border border-dark bg-background-light-gray   pl-2  text-sm tracking-wide text-primary-dark-gray outline-none"
            onInput$={(e, eventTarget) => (route.value = eventTarget.value)}
            onKeyPress$={(e) => {
              if (e.code === "Enter" && displayRef.value) {
                console.log(displayBaseUrl.value + route.value);
                displayRef.value.src = displayBaseUrl.value + route.value;
              }
            }}
          />
          {/* toggle button for the terminal */}
          <input id="terminal-toggle" type="checkbox" class="peer sr-only relative" checked />
          <label
            for="terminal-toggle"
            class="m-2 inline-block rounded-lg transition-transform duration-500 hover:bg-dark/10 peer-checked:left-64 peer-checked:bg-yellow"
          >
            <TerminalIcon width={25} height={25} />
          </label>
          <div class="fixed bottom-0 z-20 w-full translate-y-full transform bg-white shadow-lg transition-all duration-500 peer-checked:translate-y-0">
            <Terminal />
          </div>
          {/* <TerminalIcon onClick$={() => }/> */}
        </div>
        {/* display window */}
        <iframe ref={displayRef}></iframe>
      </div>
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
