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
import { TerminalContext } from "~/routes/[lang.]/(wrapper)/codeplayground";

export interface TerminalStore {
  fitAddon: NoSerialize<FitAddon> | null;
  terminal: NoSerialize<Terminal> | null;
}

export default component$(() => {
  useStyles$(xtermStyles);

  const terminalStore = useContext(TerminalContext);

  const terminalOutputRef = useSignal<HTMLElement>();

  useVisibleTask$(async ({ cleanup }) => {
    const resizeListener: any = null;

    const terminal = new Terminal({
      rows: 15,
      convertEol: true,
    });

    const fitAddon = new FitAddon();

    if (terminalOutputRef.value) {
      terminal.open(terminalOutputRef.value);

      // terminal.loadAddon(fitAddon);
      // fitAddon.fit();

      // resizeListener = window.addEventListener("resize", () => {
      //   fitAddon.fit();
      // });
    } else {
      console.error("Unable to initialize terminal!!");
    }

    // terminalStore.fitAddon = noSerialize(fitAddon);
    terminalStore.terminal = noSerialize(terminal);

    cleanup(() => {
      if (resizeListener) window.removeEventListener("resize", resizeListener);
    });
  });

  return <div ref={terminalOutputRef}></div>;
});
