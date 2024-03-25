import { Slot, component$, useContextProvider, useStore, useOnDocument, $ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { QwikCityNprogress } from "@quasarwork/qwik-city-nprogress";

import type theme from "~/const/theme";
import { themeContext } from "~/context/themeContext";

export const useTheme = routeLoader$((event) => {
  const userTheme = event.cookie.get("theme")?.value as (typeof theme)[number] | undefined;
  return userTheme ?? "default";
});

export default component$(() => {
  const theme = useTheme().value;
  const themeStore = useStore({ value: theme });
  useContextProvider(themeContext, themeStore);

  // there will be a flicker which is not good, instead we push user to set the theme value in cookie which has no flickers
  // edit: there is no more flicker with qinit listener 

  useOnDocument("qinit", $(() => {
    if (
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      themeStore.value === "default"
    ) {
      themeStore.value = "dark";
    }
  }));

  return (
    <>
      <QwikCityNprogress
        options={{
          color: themeStore.value === "dark" ? "#72cada" : "#72cada",
        }}
      />
      <div id="darkThemeDiv" class={themeStore.value}>
        <Slot />
      </div>
    </>
  );
});
