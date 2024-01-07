import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import styles from "./index.module.css";

const texts = [
  <p key="text1" class={"text-xl leading-[2.5rem] tracking-wide"}>
    <strong>React</strong> is a JavaScript framework that helps build{" "}
    <span class="border-b-8 border-light-yellow bg-background-light-gray">
      interactive and reusable user interfaces
    </span>
    . It simplifies UI development by breaking it down into smaller components that{" "}
    <span class="highlight-pink">update efficiently</span>.
  </p>,
  <p key="text2" class="text-xl leading-[2.5rem] tracking-wide">
    <strong>Next.js</strong> is a framework for building web applications with{" "}
    <strong>React</strong>. It simplifies{" "}
    <span class="highlight-yellow">server-side rendering</span>, routing, and code splitting, making
    it easier to create <span class="highlight-pink">fast and optimized</span> websites with React.
  </p>,
];

const titles = ["React", "Next.js"];

export default component$(() => {
  const delay = useSignal(3000);
  const textIndex = useSignal(0);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const loop = () => {
      textIndex.value = (textIndex.value + 1) % texts.length;
      setTimeout(() => setTimeout(loop, 500), delay.value);
    };
    setTimeout(() => setTimeout(loop, 500), delay.value);
  });

  return (
    <section class="h-[100vh] bg-lilac">
      <div class="flex h-[100vh] flex-col items-center justify-center">
        <div class="flex h-[40%] items-center justify-center">
          <h1 class="text-center font-mosk text-[2.5rem] font-[900] leading-[3.5rem]">
            A wide varieties of tutorials on your favourite framework,
            <br />
            written in{" "}
            <span class="underline decoration-wavy [text-underline-offset:12px]">simple</span>{" "}
            languages.
          </h1>
        </div>
        <div class="relative flex h-[60%] items-start">
          <div class="h-[400px] w-[900px]">
            <div class="absolute h-[400px] w-[900px] -translate-x-10 -translate-y-8 rounded-lg border-2 border-black bg-rose"></div>
            <div class="flex- relative z-10 h-full w-full items-center justify-center rounded-lg border-2 border-black bg-background-light-gray">
              <div class="h-full w-full p-[10%]">
                <h2 class="absolute left-[50%] -ml-8 -translate-x-[50%] whitespace-nowrap text-3xl font-bold tracking-wide">
                  <div class="inline-block">Getting Started With</div>
                  <div class="ml-8 inline-flex w-[200px] justify-center border-b-8 border-mint px-2">
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
                <div class={" absolute left-[50%] top-[180px] w-[80%] -translate-x-[50%]"}>
                  {texts.map((text, index) => (
                    <div
                      key={`textWrapper${index}`}
                      class={`${textIndex.value === index ? styles.textAppear : "hidden"}`}
                    >
                      {text}
                    </div>
                  ))}

                  {/* <p class="text-xl leading-[2.5rem] tracking-wide">
                  <strong>Next.js</strong> is a framework for building web applications with{" "}
                  <strong>React</strong>. It simplifies{" "}
                  <span class="highlight-yellow">server-side rendering</span>, routing, and
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
