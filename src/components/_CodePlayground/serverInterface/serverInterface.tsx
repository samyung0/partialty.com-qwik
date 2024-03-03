import { type PropFunction } from "@builder.io/qwik";
import type { BufferEncoding, WebContainerProcess } from "@webcontainer/api";
import { WebContainer } from "@webcontainer/api";
import { type Terminal } from "xterm";
import type { FileStore, Tree } from "~/utils/fileUtil";
import { addFileTree, addFolderTree, removeFileTree, removeFolderTree } from "~/utils/fileUtil";

import chokidarStandalone from "~/assets/chokidar/index.txt?raw";
export class WebContainerInterface {
  #webcontainerInstance: WebContainer | null;
  #terminal: Terminal | null;
  #shellProcess: WebContainerProcess | null;
  #terminalResize: any;
  #watchFilesProcess: WebContainerProcess | null;
  #watchFilesChokidarHasRemoved: boolean;
  #isWatchFilesActive: boolean;
  #debounceFileEvents: any;
  #fileEventsQueue: string[];
  fileStore: FileStore;
  isErrored: boolean;

  constructor(fileStore: FileStore) {
    // if ((globalThis as any).webcontainerInstance) {
    //   throw new Error("Webcontainer is already initialized!");
    // }
    // if ((globalThis as any).webContainerClosed) {
    //   throw new Error("Webcontainer is already closed!");
    // }
    this.#webcontainerInstance = null;
    this.#shellProcess = null;
    this.#terminal = null;
    this.isErrored = false;
    this.#watchFilesProcess = null;
    this.#watchFilesChokidarHasRemoved = false;
    this.#isWatchFilesActive = false;
    this.fileStore = fileStore;
    this.#debounceFileEvents = null;
    this.#fileEventsQueue = [];
  }

  async init() {
    try {
      this.#webcontainerInstance = await WebContainer.boot();
      // (globalThis as any).webcontainerInstance = this.#webcontainerInstance;
    } catch (e) {
      console.error(e);
      this.isErrored = true;
    }
  }

  async relocateTerminal(terminal: Terminal) {
    this.#shellProcess?.kill();
    if (this.#terminalResize) window.removeEventListener("resize", this.#terminalResize);
    if (!this.#webcontainerInstance) return;

    const shellProcess = await this.#webcontainerInstance.spawn("jsh");
    shellProcess.output.pipeTo(
      new WritableStream({
        write: (data) => {
          terminal.write(data);
        },
      })
    );

    // allow input on the terminal
    const input = shellProcess.input.getWriter();
    terminal.onData((data) => {
      input.write(data);
      console.log(data);
    });

    // const installDependencies = await this.#webcontainerInstance.spawn("npm", ["install"]);
    // installDependencies.output.pipeTo(
    //   new WritableStream({
    //     write: (data) => {
    //       terminal.write(data);
    //     },
    //   })
    // );
    this.#shellProcess = shellProcess;
    this.#terminal = terminal;

    this.#terminalResize = window.addEventListener("resize", () => {
      shellProcess.resize({
        cols: terminal.cols,
        rows: terminal.rows,
      });
    });
  }

  /**
   * I guess node -e blablabla does not work well
   * So instead we create a single file containing all the chokidar codes (compiled by @vercel/ncc)
   * run it, and then remove the file after it gets loaded into the memory (when the first log comes in)
   * VERY RISKY INDEED
   */
  async watchFiles() {
    if (!this.#webcontainerInstance) throw new Error("WebContainer is not initialized!");

    this.#isWatchFilesActive = true;
    const filename = "chokidar" + Date.now().toString();
    await this.#webcontainerInstance.fs.writeFile(filename, chokidarStandalone);
    this.#watchFilesProcess = await this.#webcontainerInstance.spawn("node", [filename]);
    await new Promise<void>((res) =>
      this.#watchFilesProcess!.output.pipeTo(
        new WritableStream({
          write: async (data) => {
            if (!this.#watchFilesChokidarHasRemoved) {
              await this.rm(filename, false);
              this.#watchFilesChokidarHasRemoved = true;
              res();
            }

            // file events
            if (!this.#isWatchFilesActive) return;
            // omit chokidar file events RISKY AGAIN
            if (data.includes(filename)) return;

            console.log(data);
            this.#fileEventsQueue.push(data);
            if (this.#debounceFileEvents) clearTimeout(this.#debounceFileEvents);
            this.#debounceFileEvents = setTimeout(() => {
              console.log("process");
              this.#processFileEventsChokidar([...this.#fileEventsQueue]);
              this.#fileEventsQueue = [];
            }, 300);
          },
        })
      )
    );
  }

  async loadGithub(owner: string, repo: string, branch: string = "main") {
    // if (!this.#webcontainerInstance) throw new Error("WebContainer is not initialized!");
    // const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;
    // const t = await this.#webcontainerInstance.spawn("node", ["-e", githubFetchStandalone.replace("$$$GITHUB_URL$$$", url)]);
    // t!.output.pipeTo(
    //   new WritableStream({
    //     write: async (data) => {
    //       console.log(data);
    //     },
    //   })
    // )
  }

  #processFileEventsChokidar(events: string[]) {
    // doesnt really debounce good enough since it is modifying proxy value directly
    // and the update timing is left for qwik to handle
    for (let i = 0; i < events.length; i++) {
      const command = events[i].slice(0, events[i].indexOf(" "));
      const path = events[i].slice(events[i].indexOf(" ") + 1).trim();
      if (path === "") continue;
      if (command === "add") addFileTree(this.fileStore.entries, this.fileStore.path + path);
      else if (command === "addDir" && path[0] !== ".")
        addFolderTree(this.fileStore.entries, this.fileStore.path + path);
      else if (command === "unlinkDir")
        removeFolderTree(this.fileStore.entries, this.fileStore.path + path);
      else if (command === "unlink")
        removeFileTree(this.fileStore.entries, this.fileStore.path + path);
    }
  }

  async mountFiles(files: Tree) {
    return await this.#webcontainerInstance!.mount(files);
  }

  async readFile(path: string) {
    // should not directly return Uint8Array since its not serializable in qwik
    const data = await this.#webcontainerInstance!.fs.readFile(path);
    return Array.from(data);
  }

  async readSimpleFile(path: string) {
    return await this.#webcontainerInstance!.fs.readFile(path, "utf-8");
  }

  async readdir(path: string, withFileTypes: boolean = true, encoding?: BufferEncoding) {
    // the type reference for webcontainer api is written in a weird way
    return withFileTypes
      ? await this.#webcontainerInstance!.fs.readdir(path, {
          encoding,
          withFileTypes: true,
        })
      : await this.#webcontainerInstance!.fs.readdir(path, {
          encoding,
          withFileTypes: false,
        });
  }

  async mkdir(path: string, recursive: boolean = true) {
    return recursive
      ? await this.#webcontainerInstance!.fs.mkdir(path, { recursive: true })
      : await this.#webcontainerInstance!.fs.mkdir(path, { recursive: false });
  }

  async rm(path: string, recursive: boolean = true) {
    return recursive
      ? await this.#webcontainerInstance!.fs.rm(path, { recursive: true })
      : await this.#webcontainerInstance!.fs.rm(path, { recursive: false });
  }

  async writeFile(path: string, data: string, encoding?: BufferEncoding) {
    return await this.#webcontainerInstance!.fs.writeFile(path, data, { encoding });
  }

  async runTerminal(
    command: string,
    args: string[],
    showInTerminal: boolean = true,
    cbOnOutput?: PropFunction<(data: string) => any>
  ) {
    const process = await this.#webcontainerInstance!.spawn(command, args);
    process.output.pipeTo(
      new WritableStream({
        write: (data) => {
          cbOnOutput?.(data);
          if (showInTerminal) this.#terminal?.write(data);
        },
      })
    );
    return await process.exit;
  }

  onPort(func: PropFunction<(port: number, type: "close" | "open", url: string) => any>) {
    return this.#webcontainerInstance!.on("port", func);
  }

  onServerReady(func: PropFunction<(port: number, url: string) => any>) {
    return this.#webcontainerInstance!.on("server-ready", func);
  }

  onError(func: PropFunction<(error: { message: string }) => any>) {
    return this.#webcontainerInstance!.on("error", (error: { message: string }) => {
      this.isErrored = true;
      func(error);
    });
  }

  // async clean() {
  //   // should not teardown the webcontainer instance since it can only be called once
  //   // instead we simply remove all files
  //   // DO NOT simply rm(*)
  //   this.#isWatchFilesActive = false;
  //   this.#watchFilesProcess?.kill();
  //   ((await this.readdir("/")) as DirEnt<string>[]).forEach((dirEnt) => this.rm(dirEnt.name));
  // }

  close() {
    // !! should only be called when the page is removed
    this.#isWatchFilesActive = false;
    this.#shellProcess?.kill();
    this.#watchFilesProcess?.kill();
    if (this.#terminalResize) window.removeEventListener("resize", this.#terminalResize);
    this.#webcontainerInstance?.teardown();
    // (globalThis as any).webContainerClosed = true;
    // (globalThis as any).webcontainerInstance = null;
  }
}
