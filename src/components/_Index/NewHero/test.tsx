import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

import * as matter from 'matter-js';
import p5 from 'p5';

export default component$(() => {
  const canvas = useSignal<HTMLDivElement>();
  useVisibleTask$(({ track }) => {
    track(() => canvas.value);
    if (!canvas.value) return;
    console.log('init');
    new p5((p) => {
      p.setup = () => {
        matter.Engine.create();
        p.createCanvas(canvas.value!.offsetWidth, canvas.value!.offsetHeight);
        p.background('rgba(0, 0, 0, 0)');
      };
      p.draw = () => {
        // p.background(220);
      };
    }, canvas.value);
  });
  return (
    <div class="relative h-screen w-full">
      <main>Content</main>
      <div ref={canvas} class="absolute top-0 h-full w-full"></div>
    </div>
  );
});
