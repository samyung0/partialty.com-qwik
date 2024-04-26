import { $, component$, useOnDocument, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import p5 from "p5"
import * as matter from 'matter-js'

export default component$(() => {
  const canvas = useSignal<HTMLDivElement>();
  useVisibleTask$(({track}) => {
    track(() => canvas.value);
    if(!canvas.value) return;
    console.log("init");
    new p5((p) => {
      p.setup = () => {
        matter.Engine.create();
        p.createCanvas(canvas.value!.offsetWidth, canvas.value!.offsetHeight);
        p.background('rgba(0, 0, 0, 0)');
      };
      p.draw = () => {
        // p.background(220);
      };
    }, canvas.value)
  })
  return <div class="h-screen w-full relative">
    <main>Content</main>
    <div ref={canvas} class="absolute top-0 w-full h-full"></div>
  </div>
})