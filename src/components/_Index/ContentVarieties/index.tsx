import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import styles from "./index.module.css";

const texts = [
  <p
    key="text1"
    class={"text-base md:tracking-wide lg:text-lg lg:leading-[2rem] xl:text-xl xl:leading-[2.5rem]"}
  >
    <strong>React</strong> is a JavaScript framework that helps build{" "}
    <span class="border-b-4 border-bright-yellow xl:border-b-8">
      interactive and reusable user interfaces
    </span>
    . It simplifies UI development by breaking it down into smaller components that{" "}
    <span class="highlight-pink whitespace-nowrap">update efficiently</span>.
  </p>,
  <p
    key="text2"
    class="text-base md:tracking-wide lg:text-lg lg:leading-[2rem] xl:text-xl xl:leading-[2.5rem]"
  >
    <strong>Next.js</strong> is a framework for building web applications with{" "}
    <strong>React</strong>. It simplifies{" "}
    <span class="highbright-yellow">server-side rendering</span>, routing, and code splitting,
    making it easier to create{" "}
    <span class="highlight-pink whitespace-nowrap">fast and optimized</span> websites with React.
  </p>,
  <p
    key="text3"
    class="text-base md:tracking-wide lg:text-lg lg:leading-[2rem] xl:text-xl xl:leading-[2.5rem]"
  >
    <strong>Astro</strong> is a framework that enables developers to build websites using a mix of{" "}
    <span class="border-b-4 border-lilac xl:border-b-8">static and dynamic</span> content. It allows
    for faster performance, easier maintenance, and seamless integration with{" "}
    <span class="highbright-yellow whitespace-nowrap">other frameworks</span>.
  </p>,
];

const titles = ["React", "Next.js", "Astro"];

export default component$(() => {
  const delay = useSignal(2000);
  const textIndex = useSignal(0);

  useVisibleTask$(() => {
    const loop = () => {
      textIndex.value = (textIndex.value + 1) % texts.length;
      setTimeout(() => setTimeout(loop, 500), delay.value);
    };
    setTimeout(() => setTimeout(loop, 500), delay.value);
  });

  return (
    <section class="h-[100vh] bg-lilac">
      <div class="flex h-[100vh] flex-col items-center justify-center gap-24">
        <div class="flex items-center justify-center">
          <h1 class="p-2 text-center font-mosk text-2xl font-[900] md:text-3xl lg:text-[2rem] lg:leading-[3rem] xl:text-[2.5rem] xl:leading-[3.5rem]">
            There is a wide variety of tutorials on your favourite framework,
            <br />
            written in{" "}
            <span class="underline decoration-wavy underline-offset-[8px] lg:[text-underline-offset:12px] ">
              simple
            </span>{" "}
            words.
          </h1>
        </div>
        <div class="relative flex items-start">
          <div class="h-[300px] w-[500px] max-w-[90vw] lg:h-[350px] lg:w-[800px] xl:h-[400px] xl:w-[900px]">
            <div class="absolute h-[300px] w-[500px] max-w-[90vw] -translate-x-3 -translate-y-3 rounded-lg border-2 border-black bg-rose lg:h-[350px] lg:w-[800px] lg:-translate-x-6 lg:-translate-y-4 xl:h-[400px] xl:w-[900px] xl:-translate-x-10 xl:-translate-y-8"></div>
            <div class="relative z-10 flex h-full items-center justify-center rounded-lg border-2 border-black bg-background-light-gray">
              <div class="flex h-full w-full flex-col items-center justify-center gap-4 px-4 md:block md:pt-[60px] lg:pt-[90px] xl:p-[10%]">
                <h2 class="left-[50%] whitespace-nowrap text-lg font-bold md:absolute md:-translate-x-[50%] md:tracking-wide lg:-ml-8 lg:text-2xl xl:text-3xl">
                  <div class="inline-block">Getting Started With</div>
                  <div class="ml-2 inline-flex w-[80px] justify-center border-b-4 border-mint px-2 md:w-[100px] lg:ml-8 lg:w-[150px] lg:border-b-8 xl:w-[200px]">
                    {titles.map((title, index) => (
                      <div
                        key={`title${index}`}
                        class={`inline-block ${
                          textIndex.value === index ? styles.titleAppear : "hidden"
                        }`}
                      >
                        {title}
                      </div>
                    ))}
                  </div>
                </h2>
                <div
                  class={
                    " left-[50%] top-[130px] w-full md:absolute md:w-[80%] md:-translate-x-[50%] md:p-0 md:px-4 lg:top-[160px] xl:top-[180px]"
                  }
                >
                  {texts.map((text, index) => (
                    <div
                      key={`textWrapper${index}`}
                      class={`${textIndex.value === index ? styles.textAppear : "hidden"}`}
                    >
                      {text}
                    </div>
                  ))}

                  {/* <p class="lg:text-xl lg:leading-[2.5rem] text-lg leading-[2rem] tracking-wide">
                  <strong>Next.js</strong> is a framework for building web applications with{" "}
                  <strong>React</strong>. It simplifies{" "}
                  <span class="highbright-yellow">server-side rendering</span>, routing, and
                  code splitting, making it easier to create{" "}
                  <span class="highlight-pink">fast and optimized</span> websites with React.
                </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
