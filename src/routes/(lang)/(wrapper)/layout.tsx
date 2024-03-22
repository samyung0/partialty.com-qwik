import { component$, Slot, useContextProvider, useStore } from "@builder.io/qwik";
import { StaticGenerateHandler } from "@builder.io/qwik-city";

import { globalContext } from "~/context/globalContext";
import { config } from "~/speak-config";
import { defaultValue, type GlobalContextType } from "~/types/GlobalContext";

export default component$(() => {
  const globalStore = useStore(Object.assign({}, defaultValue) as GlobalContextType);
  useContextProvider(globalContext, globalStore);

  return <Slot />;
});
