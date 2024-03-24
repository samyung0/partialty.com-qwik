import { component$, Slot, useContextProvider, useStore } from "@builder.io/qwik";

import { globalContext } from "~/context/globalContext";
import { defaultValue, type GlobalContextType } from "~/types/GlobalContext";

export default component$(() => {
  const globalStore = useStore(Object.assign({}, defaultValue) as GlobalContextType);
  useContextProvider(globalContext, globalStore);

  return <Slot />;
});
