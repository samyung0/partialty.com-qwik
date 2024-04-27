import { $, component$, useContextProvider, useOnDocument, useStore } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import * as Sentry from '@sentry/browser';
import posthog from 'posthog-js';
import { useQwikSpeak } from 'qwik-speak';
import { config as _config } from '~/speak-config';
import { translationFn } from '~/speak-function';
import { RouterHead } from './components/router-head/router-head';

import { layoutContext } from '~/context/layoutContext';
import '../tailwind/css/global.css';

import { Insights } from '@builder.io/qwik-labs';

export default component$(() => {
  const layoutStore = useStore({ value: 'default' });
  useContextProvider(layoutContext, layoutStore);

  useQwikSpeak({ config: _config, translationFn });

  useOnDocument(
    'qinit',
    $(() => {
      if (import.meta.env.MODE !== 'development') return;
      Sentry.init({
        dsn: 'https://b1f6cefb9529f993bf199ee1e8e80343@o4507112021688320.ingest.us.sentry.io/4507112031453184',
        integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/partialty\.com\/api/],
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });
      posthog.init('phc_f9K7W6DZOPs3yTLZhNlKmOubc17qdUszPhxc2gQqpBv', { api_host: 'https://app.posthog.com' });
    })
  );

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <RouterHead />
        <ServiceWorkerRegister />
        <Insights publicApiKey={import.meta.env.PUBLIC_QWIK_INSIGHTS_KEY} />
      </head>
      <body>
        <RouterOutlet layout={layoutStore.value} />

        <script
          dangerouslySetInnerHTML={`
          const dark = document.getElementById("darkThemeDiv");
          if (window.matchMedia('(prefers-color-scheme: light)').matches && dark.classList.contains("darkDefault")) {
            dark.classList.remove("dark");
            dark.classList.add("light");
          }
          const rootTransitions = Array.from(document.getElementsByClassName('root-main'));
          rootTransitions.forEach(x => {
            setTimeout(() => {
              x.classList.add('start')
              
            }, 1000);
          })
        `}
        ></script>
        {/* <script
          src="https://cdn.jsdelivr.net/gh/LieutenantPeacock/SmoothScroll@1.2.0/src/smoothscroll.min.js"
          integrity="sha384-UdJHYJK9eDBy7vML0TvJGlCpvrJhCuOPGTc7tHbA+jHEgCgjWpPbmMvmd/2bzdXU"
          crossOrigin="anonymous"
        ></script> */}
      </body>
    </QwikCityProvider>
  );
});
