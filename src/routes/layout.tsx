import { $, Slot, component$, useContextProvider, useOnDocument, useStore } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { QwikCityNprogress } from '@quasarwork/qwik-city-nprogress';

import type theme from '~/const/theme';
import { themeContext } from '~/context/themeContext';

export const useTheme = routeLoader$((event) => {
  const userTheme = event.cookie.get('theme')?.value as (typeof theme)[number] | undefined;
  return userTheme ?? 'default';
});

export default component$(() => {
  const theme = useTheme().value;
  const themeStore = useStore({ value: theme });
  useContextProvider(themeContext, themeStore);

  useOnDocument(
    'qinit',
    $(() => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches && themeStore.value === 'default') {
        themeStore.value = 'dark';
      }
    })
  );

  return (
    <>
      <QwikCityNprogress
        options={{
          color: themeStore.value === 'dark' ? '#72cada' : '#72cada',
        }}
      />
      <div id="darkThemeDiv" class={themeStore.value}>
        <Slot />
      </div>
    </>
  );
});
