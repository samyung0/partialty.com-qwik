import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import "./global.css";

import { defaultValue, type GlobalContextType } from "./types/GlobalContext";

export const globalContext = createContextId<GlobalContextType>("global");

export default component$(() => {
  const globalStore = useStore(defaultValue);
  useContextProvider(globalContext, globalStore);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
