import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <footer class=" bg-primary-dark-gray text-background-light-gray dark:bg-disabled-dark">
      <div class="flex w-full flex-col items-center justify-center py-20 pt-40 xl:flex-row xl:items-start">
        <div class="pb-8 text-center xl:w-[50%]">
          <p class="text-[2rem] font-bold tracking-widest">Partialty.com</p>
        </div>
        <div class="xl:w-[50%]">
          <ul class="grid gap-8 px-8 md:flex  md:gap-12">
            <li class="text-base md:text-lg">
              <ul class="flex flex-col gap-3">
                <li class="tracking-tight text-gray-400">Resources</li>
                <li>
                  <Link href="/">Courses</Link>
                </li>
                <li>
                  <Link href="/">Projects</Link>
                </li>
                <li>
                  <Link href="/">Guides</Link>
                </li>
                <li>
                  <Link href="/">Pricing</Link>
                </li>
                <li></li>
              </ul>
            </li>
            <li class="text-base md:text-lg">
              <ul class="flex flex-col gap-3">
                <li class="tracking-tight text-gray-400">Help and Support</li>
                <li>
                  <Link href="/">Contact Us</Link>
                </li>
                <li>
                  <Link href="/">Make Suggestions</Link>
                </li>
                <li>
                  <Link href="/">Work with Us</Link>
                </li>
              </ul>
            </li>
            <li class="text-base md:text-lg">
              <ul class="flex flex-col gap-3">
                <li class="tracking-tight text-gray-400">Legal</li>
                <li>
                  <Link href="/">License (EULA)</Link>
                </li>
                <li>
                  <Link href="/">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/">Terms and Condition</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="mx-auto h-[2px] w-[80%] bg-gray-600"></div>
      <p class="py-10 text-center">© 2024 Partialty</p>
    </footer>
  );
});
