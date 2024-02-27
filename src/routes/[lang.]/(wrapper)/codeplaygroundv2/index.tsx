import type { NoSerialize } from "@builder.io/qwik";
import { $, component$, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import filesF from "~/__filesTest";
import Editor from "~/components/_CodePlayground/editor/editor";
import { WebContainerInterface } from "~/components/_CodePlayground/serverInterface/serverInterface";
import Terminal, { type TerminalStore } from "~/components/_CodePlayground/terminal/terminal";
import type { FileStore } from "~/utils/fileUtil";

export default component$(() => {
  const refIframe = useSignal<HTMLIFrameElement>();

  const interfaceStore = useSignal<NoSerialize<WebContainerInterface> | null>(null);
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
  const controlStore = useStore({
    interfaceReady: false,
    interfaceBooted: false,
  });

  const onPortOpen = $((port: number, type: "open" | "close", url: string) => {
    console.log(port, type, url);
    if (type === "open") {
      if (refIframe.value) refIframe.value.src = url;
    }
  });
  useVisibleTask$(() => {
    const webContainer = new WebContainerInterface(fileStore);
    webContainer.init().then(() => {
      controlStore.interfaceBooted = true;
    });
    interfaceStore.value = noSerialize(webContainer);
  });
  useVisibleTask$(async ({ track }) => {
    track(() => terminalStore.terminal);
    track(() => controlStore.interfaceBooted);

    if (controlStore.interfaceReady) return;
    if (terminalStore.terminal && controlStore.interfaceBooted && interfaceStore.value) {
      await interfaceStore.value.relocateTerminal(terminalStore.terminal);
      await interfaceStore.value.mountFiles(filesF);
      await interfaceStore.value.watchFiles();
      // await interfaceStore.value.loadGithub("samyung0", "Template_react_1");

      interfaceStore.value.onPort(onPortOpen);
      controlStore.interfaceReady = true;
    }
  });

  return (
    <section>
      {controlStore.interfaceReady ? (
        <Editor
          interfaceStore={interfaceStore}
          onFileSave={$((path: string, data: string) => {
            interfaceStore.value?.writeFile(path, data);
          })}
          fileStore={fileStore}
          editorStyle={{ height: "300px" }}
        />
      ) : null}
      <Terminal terminalStore={terminalStore} style={{ height: "200px" }} />
      <div style={{ position: "relative" }} class="preview">
        {!controlStore.interfaceReady ? (
          <div style={{ position: "absolute", height: "100%", width: "100%", background: "red" }}>
            Loading...
          </div>
        ) : null}
        <iframe style={{ width: "100%" }} ref={refIframe}></iframe>
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
