import type { QRL } from '@builder.io/qwik';
import { component$, useSignal } from '@builder.io/qwik';

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
  return (
    <div
      document:onScroll$={() => {
        console.log('yo');
        console.log(elementIsVisibleInViewport(ref.value), hasSaved.value);
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
