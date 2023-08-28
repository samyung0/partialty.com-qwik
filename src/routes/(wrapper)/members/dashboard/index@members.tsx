import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const isShow = useSignal(true);
  return (
    <main>
      {isShow.value && (
        <div class="text-gray-900">
          <div class="text-2xl">Welcome to the Dashboard Page</div>
          <Link href="/">
            <button class="text-sm text-sky-500 hover:text-sky-400">Home page</button>
          </Link>
        </div>
      )}
    </main>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
  meta: [
    {
      name: "description",
      content: "Members dashboard for Code Raiders",
    },
  ],
};
