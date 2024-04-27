import { component$ } from '@builder.io/qwik';

import GoogleMail from "~/assets/svg/google_mail.png"
import GoogleForm from "~/assets/svg/google_form.png"


export default component$(() => {
  return (
    <section class="mx-auto mt-16 grid max-w-xl sm:mt-20 lg:mt-24 lg:max-w-2xl">
      <ul role="list" class="divide-y dark:divide-gray-700">
        <li class="flex justify-between gap-x-6 py-5">
          <a
            target="_blank"
            href="mailto:yungchinpang999@gmail.com"
            class="flex w-full items-center justify-center gap-4"
          >
            <img src={GoogleMail} alt="GoogleMail" width="30" height="30" class="size-[30px] object-contain" />
            <span>Mail</span>
          </a>
        </li>
        <li class="flex justify-between gap-x-6 py-5">
          <a
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSc06Zk8cVjiTGBmDd8Aj0mWlnbmx21nQUx3gvJK3bkb87QpOg/viewform?usp=sf_link"
            class="flex w-full items-center justify-center gap-4"
          >
            <span class="rounded-xl bg-background-light-gray dark:p-2">
              <img src={GoogleForm} alt="Google Form" width="30" height="30" class="size-[30px] object-contain" />
            </span>
            <span>Google Form</span>
          </a>
        </li>
      </ul>
    </section>
  );
});
