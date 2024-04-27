import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <section class="flex flex-wrap items-center justify-center px-4 pb-16 text-sm tracking-wide md:text-base">
      Made with ❤️ by Sam
      <img
        src="https://lh3.googleusercontent.com/a/ACg8ocIP86qPV9CbWx6OZ_6GL8sFNtxfz-REeUd99YRvtm9LxH4etYAiHQ=s576-c-no"
        referrerPolicy="no-referrer"
        width="40"
        height="40"
        class="mx-4 block size-[30px] rounded-full object-contain md:size-[40px]"
      />{' '}
      from Hong Kong
    </section>
  );
});
