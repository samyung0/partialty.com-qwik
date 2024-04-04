import type { QRL } from '@builder.io/qwik';
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

const elementIsVisibleInViewport = (el: any, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

export default component$(({ saveProress }: { saveProress: QRL<() => any> }) => {
  const ref = useSignal<HTMLDivElement>();
  const hasSaved = useSignal(false);
  useVisibleTask$(({track}) => {
    track(ref);
    if(!ref.value) return;
    if (elementIsVisibleInViewport(ref.value) && !hasSaved.value) {
      hasSaved.value = true;
      saveProress();
    }
  })
  return (
    <div
      document:onScroll$={() => {
        if (elementIsVisibleInViewport(ref.value) && !hasSaved.value) {
          hasSaved.value = true;
          saveProress();
        }
      }}
      class="h-0"
      ref={ref}
    >
      &nbsp;
    </div>
  );
});
