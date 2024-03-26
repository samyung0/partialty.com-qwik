import type { QRL } from '@builder.io/qwik';
import { component$, useVisibleTask$ } from '@builder.io/qwik';

export default component$(({ saveProress }: { saveProress: QRL<() => any> }) => {
  useVisibleTask$(
    () => {
      saveProress();
    },
    {
      strategy: 'intersection-observer',
    }
  );
  return <div class="h-0">&nbsp;</div>;
});
