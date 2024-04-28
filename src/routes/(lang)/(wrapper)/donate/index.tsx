import { $, component$ } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import Nav from '~/components/_Index/NewHero/nav';

import DonateLinks from './DonateLinks';

import { documentHead } from '~/head';

export default component$(() => {
  return (
    <div class="bg-background-light-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav/>
      <main class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-indigo-600">Donate</h2>
            <p class="mt-2 font-mosk text-3xl font-bold tracking-wide sm:text-4xl">Support the Cause!</p>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              We have been working really hard on providing free and high-quality courses with unique features that
              other platforms do not provide. We believe by making the learning progress as fun and enjoyable as
              possible, more people will be willing to learn web development and be part of the community. If you are
              willing to support the cause, feel free to donate or contribute!
            </p>
          </div>
          <DonateLinks />
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl class="mx-auto grid max-w-xl grid-cols-1 gap-x-16 gap-y-16 lg:max-w-4xl lg:grid-cols-2">
              <div class="flex flex-col">
                <dt class="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <span class="size-[20px] text-tomato">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-hand-coins"
                    >
                      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                      <path d="m2 16 6 6" />
                      <circle cx="16" cy="9" r="2.9" />
                      <circle cx="6" cy="5" r="3" />
                    </svg>
                  </span>
                  Legitimate Use
                </dt>
                <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p class="flex-auto">
                    100% of the money received from opencollective and buymeacoffee platform will be used for course
                    curation and hiring voice overs. We guarantee that no money will be spend in any other way (except
                    maybe a cup of coffee occasionally :D).
                  </p>
                </dd>
              </div>
              <div class="flex flex-col">
                <dt class="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <span class="size-[20px] text-sea -translate-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-file-check-2"
                    >
                      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="m3 15 2 2 4-4" />
                    </svg>
                  </span>
                  Expand the Courses
                </dt>
                <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p class="flex-auto">
                    It takes a huge amount of time and effort for us to sort through the learning materials for each
                    course. We also hire our own voice actors for voice over of the courses, which mean we also need to
                    write our own scripts and pay extra money if any changes were made. Therefore, supporting us will
                    definitely allow us to put more resources into curating courses for all of you.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
});

export const head = {...documentHead, title: 'Donate'};
