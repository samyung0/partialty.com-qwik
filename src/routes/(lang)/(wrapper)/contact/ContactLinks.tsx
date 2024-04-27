import { $, component$ } from '@builder.io/qwik';
import { toast } from 'sonner';

import { Link } from '@builder.io/qwik-city';
import { LuCopy, LuGithub, LuInstagram, LuLinkedin, LuMail } from '@qwikest/icons/lucide';
// import OpenCollective from '~/assets/img/open_collective.png';

export default component$(() => {
  const handleClick = $((link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Copied to Clipboard!');
  });
  return (
    <section class="mx-auto mt-16 grid max-w-xl sm:mt-20 lg:mt-24 lg:max-w-2xl">
      <ul role="list" class="divide-y dark:divide-gray-700">
        <li class="flex justify-center gap-x-8 py-5">
          <Link href="mailto:yungchinpang999@gmail.com" class="flex items-center justify-center gap-4">
            <span class="text-[20px]">
              <LuMail />
            </span>
            <span>Email</span>
          </Link>{' '}
          <button
            onClick$={() => {
              handleClick('mailto:yungchinpang999@gmail.com');
            }}
            class=" p-2 text-[15px]"
          >
            <LuCopy />
          </button>
        </li>
        <li class="flex items-center justify-center gap-x-8 py-5">
          <Link href="https://www.linkedin.com/in/sam-yung-14ba7b1a4/" class="flex items-center justify-center gap-4">
            <span class="text-[20px]">
              <LuLinkedin />
            </span>
            <span>LinkedIn</span>
          </Link>
          <button
            onClick$={() => {
              handleClick('https://www.linkedin.com/in/sam-yung-14ba7b1a4/');
            }}
            class=" p-2 text-[15px]"
          >
            <LuCopy />
          </button>
        </li>
        <li class="flex justify-center gap-x-8 py-5">
          <Link href="https://github.com/samyung0" class="flex items-center justify-center gap-4">
            <span class="text-[20px]">
              <LuGithub />
            </span>
            <span>Github</span>
          </Link>{' '}
          <button
            onClick$={() => {
              handleClick('https://github.com/samyung0');
            }}
            class=" p-2 text-[15px]"
          >
            <LuCopy />
          </button>
        </li>
        <li class="flex justify-center gap-x-8 py-5">
          <Link href="https://www.instagram.com/async12/" class="flex items-center justify-center gap-4">
            <span class="text-[20px]">
              <LuInstagram />
            </span>
            <span>Instagram</span>
          </Link>{' '}
          <button
            onClick$={() => {
              handleClick('https://www.instagram.com/async12/');
            }}
            class=" p-2 text-[15px]"
          >
            <LuCopy />
          </button>
        </li>
      </ul>
    </section>
  );
});
