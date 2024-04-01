import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <footer class="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" class="sr-only">
        Footer
      </h2>
      <div class="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div class="xl:grid xl:grid-cols-3 xl:gap-8">
          <p class="font-mosk text-2xl tracking-wider text-white">Partialty.com</p>
          <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div class="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm font-semibold leading-6 text-white">Resources</h3>
                <ul role="list" class="mt-6 space-y-4">
                  <li>
                    <Link href="/catalog/" class="text-sm leading-6 text-gray-300 hover:text-white">
                      Courses
                    </Link>
                  </li>
                  <li>
                    <Link href="/catalog/?type=guide" class="text-sm leading-6 text-gray-300 hover:text-white">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/about/" class="text-sm leading-6 text-gray-300 hover:text-white">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div class="mt-10 md:mt-0">
                <h3 class="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" class="mt-6 space-y-4">
                  <li>
                    <Link href="#" class="text-sm leading-6 text-gray-300 hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" class="text-sm leading-6 text-gray-300 hover:text-white">
                      Make Suggestions
                    </Link>
                  </li>
                  <li>
                    <Link href="#" class="text-sm leading-6 text-gray-300 hover:text-white">
                      Contribute
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" class="mt-6 space-y-4">
                  <li>
                    <Link href="#" class="text-sm leading-6 text-gray-300 hover:text-white">
                      License
                    </Link>
                  </li>
                  <li>
                    <Link href="#" class="text-sm leading-6 text-gray-300 hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" class="text-sm leading-6 text-gray-300 hover:text-white">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
