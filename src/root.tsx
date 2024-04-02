import { component$, useContextProvider, useStore } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { useQwikSpeak } from 'qwik-speak';
import { config as _config } from '~/speak-config';
import { translationFn } from '~/speak-function';
import { RouterHead } from './components/router-head/router-head';

import { layoutContext } from '~/context/layoutContext';
import '../tailwind/css/global.css';

export default component$(() => {
  const layoutStore = useStore({ value: 'default' });
  useContextProvider(layoutContext, layoutStore);

  useQwikSpeak({ config: _config, translationFn });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
        <script
          dangerouslySetInnerHTML={`
        window.addEventListener("load", () => {
          const dark = document.getElementById("darkThemeDiv");
          if (window.matchMedia('(prefers-color-scheme: dark)').matches && dark.classList.contains("default")) {
            console.log("not set"); 
            dark.classList.add("dark");
          }
        })
        `}
        ></script>
      </head>
      <body>
        <RouterOutlet layout={layoutStore.value} />
      </body>
    </QwikCityProvider>
  );
});
