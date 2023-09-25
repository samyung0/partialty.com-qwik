import type { NoSerialize } from "@builder.io/qwik";
import { component$, noSerialize, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface Props {
  style?: Record<string, string>;
  class?: string;
  terminalStore: TerminalStore;
}

export interface TerminalStore {
  fitAddon: NoSerialize<FitAddon> | null;
  terminal: NoSerialize<Terminal> | null;
}

export default component$((props: Props) => {
  const refTerminal = useSignal<HTMLElement>();

  useVisibleTask$(async ({ cleanup }) => {
    let resizeListener: any = null;

    const fitAddon = new FitAddon();
    const terminal = new Terminal({
      convertEol: true,
    });

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

    props.terminalStore.fitAddon = noSerialize(fitAddon);
    props.terminalStore.terminal = noSerialize(terminal);

    cleanup(() => {
      if (resizeListener) window.removeEventListener("resize", resizeListener);
    });
  });

  return <div style={props.style} class={"terminal " + props.class} ref={refTerminal}></div>;
});
