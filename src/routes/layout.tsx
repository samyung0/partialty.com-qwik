import { $, Slot, component$, useContextProvider, useOnDocument, useStore } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { QwikCityNprogress } from '@quasarwork/qwik-city-nprogress';
import Sonner from '~/components/Sonner';

import type theme from '~/const/theme';
import { themeContext } from '~/context/themeContext';

export const useTheme = routeLoader$((event) => {
  const userTheme = event.cookie.get('theme')?.value as (typeof theme)[number] | undefined;
  return userTheme ?? 'dark darkDefault';
});

export default component$(() => {
  const theme = useTheme().value;
  const themeStore = useStore({ value: theme });
  useContextProvider(themeContext, themeStore);

  useOnDocument(
    'qinit',
    $(() => {
      function getCookie(name:string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      }
      // console.log(getCookie("theme"));
      if (window.matchMedia('(prefers-color-scheme: light)').matches && themeStore.value.includes('darkDefault') && getCookie("theme") !== "dark") {
        themeStore.value = 'light';
      }
    })
  );

  return (
    <>
      <QwikCityNprogress
        options={{
          color: themeStore.value.includes('dark') ? '#72cada' : '#72cada',
        }}
      />
      <div id="darkThemeDiv" class={themeStore.value}>
        <Slot />
        <Sonner client:only theme={themeStore.value.includes('dark') ? 'dark' : 'light'} />
      </div>
    </>
  );
});
