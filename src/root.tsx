import { component$, createContextId, useContextProvider, useStore } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { QwikSpeakProvider } from "qwik-speak";
import { config } from "~/speak-config";
import { translationFn } from "~/speak-function";
import { RouterHead } from "./components/router-head/router-head";
import "./global.css";

// import { defaultValue, type envType } from "~/types/Env";

export const themeContext = createContextId<{ value: string }>("theme");
export const layoutContext = createContextId<{ value: string }>("layout");

export default component$(() => {
  const themeStore = useStore({ value: "" });
  useContextProvider(themeContext, themeStore);

  const layoutStore = useStore({ value: "default" });
  useContextProvider(layoutContext, layoutStore);

  return (
    <QwikSpeakProvider config={config} translationFn={translationFn}>
      <QwikCityProvider>
        <head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <RouterHead />
          <ServiceWorkerRegister />
        </head>
        <body lang="en" class={themeStore.value}>
          <RouterOutlet layout={layoutStore.value} />
        </body>
      </QwikCityProvider>
    </QwikSpeakProvider>
  );
});
