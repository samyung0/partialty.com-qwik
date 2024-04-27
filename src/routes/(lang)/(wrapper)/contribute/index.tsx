import { $, component$ } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import Nav from '~/components/_Index/NewHero/nav';
import TechStack from './TechStack';

// import ContactLinks from './ContactLinks';

const getUserFn = $(async () => {
  return await fetch('/api/courses/chapters/getUser/').then((x) => x.json());
});

const setThemeCookieFn = $(async (themeValue: any) => {
  const d = new FormData();
  d.append('theme', themeValue);
  return await fetch('/api/courses/chapters/setThemeCookie/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

const logout = $(() => {
  return fetch('/api/courses/logout/', {
    method: 'POST',
  });
});

export default component$(() => {
  return (
    <div class="bg-background-light-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav />
      <main class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <p class="mt-2 font-mosk text-3xl font-bold tracking-wide sm:text-4xl">Contribute</p>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              The repository is currently public, but I will just be honest, don't look into it because the
              codes are horrendous. If you want to make contributions to the code base, feel free to email me and I will
              walk you through the repo. If you want to create courses, we are currently working a text editor and you
              will be able to create your own courses very soon!
              <br />
              <a href="https://github.com/samyung0/partialty.com" target='_blank' class="underline underline-offset-2">Link to Repo</a>
            </p>
          </div>
          <TechStack />
        </div>
      </main>
      <Footer />
    </div>
  );
});
