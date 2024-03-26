import type { NoSerialize } from '@builder.io/qwik';
import {
  $,
  component$,
  createContextId,
  noSerialize,
  useContextProvider,
  useSignal,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import playgroundDefaultFiles from '~/__filesTest';
import { RefreshIcon } from '~/assets/icon/refreshIcon';
import { TerminalIcon } from '~/assets/icon/terminalIcon';
import Editor from '~/components/_CodePlayground/editor/editor';
import SampleCourse from '~/components/_CodePlayground/sampleCourse/sampleCourse';
import { WebContainerInterface } from '~/components/_CodePlayground/serverInterface/serverInterface';
import Terminal, { type TerminalStore } from '~/components/_CodePlayground/terminal/terminal';
import { cn } from '~/utils/cn';
import type { FileStore } from '~/utils/fileUtil';

export const TerminalContext = createContextId<TerminalStore>('docs.terminal-context');

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
    name: '',
    path: '/', // root path
    data: '',
    isBinary: false,
    isFolder: true,
    entries: [],
    hasChanged: false,
  });

  const displayBaseUrl = useSignal('');
  const route = useSignal('/');
  const displayRef = useSignal<HTMLIFrameElement>(); // for displaying user output
  const terminalStore = useStore<TerminalStore>({
    fitAddon: null,
    terminal: null,
  });
  useContextProvider(TerminalContext, terminalStore);

  const editorSide = useSignal(true); // true: Editor false: Tutorial
  const terminalOpen = useSignal(false);

  const onPortOpen = $((port: number, type: 'open' | 'close', url: string) => {
    console.log(port, type, url);
    if (type === 'open') {
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
      console.log('Server Interface is ready');
    }
  });

  return (
    <section class="flex h-screen flex-col">
      <div class="flex h-full max-w-[100vw] flex-nowrap overflow-hidden">
        <div
          class={` left-0 top-0 h-full min-w-[100vw] transition-transform duration-500  xl:w-[30%]   xl:min-w-[unset] xl:transform-none ${
            editorSide.value && '-translate-x-full '
          }`}
        >
          <SampleCourse />
        </div>
        <div
          class={`relative left-0 top-0 flex h-full max-h-[100vh] min-w-[100vw]  max-w-7xl   flex-col overflow-hidden transition-transform  duration-500 xl:w-[70%]  xl:min-w-[unset] xl:transform-none ${
            editorSide.value && '-translate-x-full '
          }`}
        >
          <Editor
            serverInterface={serverInterface}
            saveServerFile={saveServerFile}
            fileStore={fileStore}
            // editorStyle={{ height: "200px" }}
          />
          <div class="flex w-full flex-auto flex-col">
            {/* control set */}
            <div class="flex w-full items-center shadow shadow-slate-200/80 ring-1 ring-slate-900/5">
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
                  if (e.code === 'Enter' && displayRef.value) {
                    console.log(displayBaseUrl.value + route.value);
                    displayRef.value.src = displayBaseUrl.value + route.value;
                  }
                }}
              />
              {/* toggle button for the terminal */}
              {/* <input id="terminal-toggle" type="checkbox" class="peer sr-only relative" /> */}
              <button
                // for="terminal-toggle"
                onClick$={() => (terminalOpen.value = !terminalOpen.value)}
                class="m-2 inline-block rounded-lg transition-transform duration-500 hover:bg-dark/10 peer-checked:left-64 peer-checked:bg-custom-yellow"
              >
                <TerminalIcon width={25} height={25} />
              </button>
            </div>
            {/* display window */}
            <iframe class="flex-1" ref={displayRef}></iframe>
          </div>
          <div
            class={cn(
              'absolute bottom-0 z-20 w-full translate-y-full bg-white shadow-lg transition-all duration-500',
              terminalOpen.value && 'translate-y-0'
            )}
          >
            <Terminal />
          </div>
        </div>
      </div>
      {/* toggle button for switching between the course content and the editor */}
      <div class="z-50 flex  justify-center border border-t-dark/10 bg-background-light-gray py-2 xl:hidden">
        <label class=" inline-flex cursor-pointer items-center">
          <span class="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">Tutorial</span>
          <input
            type="checkbox"
            checked={editorSide.value}
            class="peer sr-only"
            onClick$={() => {
              editorSide.value = !editorSide.value;
            }}
          />
          <div class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Editor</span>
        </label>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: 'Code Playground',
  meta: [
    {
      name: 'description',
      content: 'Try out your app or project here!',
    },
  ],
};
