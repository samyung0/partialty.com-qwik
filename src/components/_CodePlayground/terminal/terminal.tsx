import type { NoSerialize } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  useContext,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";

import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import xtermStyles from "xterm/css/xterm.css?inline";
import { TerminalContext } from "~/routes/[lang.]/(wrapper)/codeplaygroundv2";

export interface TerminalStore {
  fitAddon: NoSerialize<FitAddon> | null;
  terminal: NoSerialize<Terminal> | null;
}

export default component$(() => {
  useStyles$(xtermStyles);

  const terminalStore = useContext(TerminalContext);

  const refTerminal = useSignal<HTMLElement>();

  useVisibleTask$(async ({ cleanup }) => {
    let resizeListener: any = null;

    console.log("Hello");

    const terminal = new Terminal({
      convertEol: true,
    });
    const fitAddon = new FitAddon();

    if (refTerminal.value) {
      terminal.loadAddon(fitAddon);
      terminal.open(refTerminal.value);
      fitAddon.fit();

      resizeListener = window.addEventListener("resize", () => {
        fitAddon.fit();
      });
    } else {
      console.error("Unable to initialize terminal!!");
    }

    terminalStore.fitAddon = noSerialize(fitAddon);
    terminalStore.terminal = noSerialize(terminal);

    cleanup(() => {
      if (resizeListener) window.removeEventListener("resize", resizeListener);
    });
  });

  return <div class="h-[200px]" ref={refTerminal}></div>;
});
