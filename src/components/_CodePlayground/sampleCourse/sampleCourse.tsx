import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="h-full overflow-y-auto">
      <p>
        Welcome to the Svelte tutorial! This will teach you everything you need to know to easily build web applications
        of all sizes, with high performance and a small footprint. You can also consult the API docs and the examples,
        or — if you're impatient to start hacking on your machine locally — create a project with npm init svelte.
      </p>

      <h2>What is Svelte?</h2>
      <hr class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
      <p>
        Svelte is a tool for building web applications. Like other user interface frameworks, it allows you to build
        your app declaratively out of components that combine markup, styles and behaviours. These components are
        compiled into small, efficient JavaScript modules that eliminate overhead traditionally associated with UI
        frameworks. You can build your entire app with Svelte (for example, using an application framework like
        SvelteKit, which this tutorial will cover), or you can add it incrementally to an existing codebase. You can
        also ship components as standalone packages that work anywhere.
      </p>
      <h2>How to use this tutorial</h2>
      <hr class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
      <p>
        Each section will present an exercise designed to illustrate a feature. Later exercises build on the knowledge
        gained in earlier ones, so it's recommended that you go from start to finish. If necessary, you can navigate via
        the menu above. If you get stuck, you can click the solve button to the left of the editor. (The solve button is
        disabled on sections like this one that don't include an exercise.) Try not to rely on it too much; you will
        learn faster by figuring out where to put each suggested code block and manually typing it in to the editor.
      </p>
    </div>
  );
});
