import { component$, createContextId, useContextProvider, useStore } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { useQwikSpeak } from "qwik-speak";
import { config as _config } from "~/speak-config";
import { translationFn } from "~/speak-function";
import { RouterHead } from "./components/router-head/router-head";

import "../tailwind/css/global.css";

export const themeContext = createContextId<{ value: string }>("theme");
export const layoutContext = createContextId<{ value: string }>("layout");

export default component$(() => {
  const themeStore = useStore({ value: "default" });
  useContextProvider(themeContext, themeStore);

  const layoutStore = useStore({ value: "default" });
  useContextProvider(layoutContext, layoutStore);

  useQwikSpeak({ config: _config, translationFn });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body class={themeStore.value}>
        <RouterOutlet layout={layoutStore.value} />
      </body>
    </QwikCityProvider>
  );
});
