import { component$, createContextId, useContextProvider, useStore } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import "./global.css";

// import { defaultValue, type envType } from "~/types/Env";

export const themeContext = createContextId<{ value: string }>("theme");

export default component$(() => {
  const themeStore = useStore({ value: "" });
  useContextProvider(themeContext, themeStore);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en" class={themeStore.value}>
        <RouterOutlet layout="default" />
      </body>
    </QwikCityProvider>
  );
});
