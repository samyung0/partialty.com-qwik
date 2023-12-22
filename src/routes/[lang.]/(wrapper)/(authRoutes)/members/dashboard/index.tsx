import { $, component$ } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { logout } from "~/auth/logout";

export default component$(() => {
  const nav = useNavigate();

  const handleLogout = $(async () => {
    logout();
    nav("/");
  });

  return (
    <main>
      <div class="text-gray-900">
        <div class="text-2xl">Welcome to the Dashboard Page</div>
        <Link href="/">
          <button class="text-sm text-sky-500 hover:text-sky-400">Home page</button>
        </Link>
        <Link href="/test/">
          <button class="text-sm text-sky-500 hover:text-sky-400">Test page</button>
        </Link>
      </div>

      <button class="ml-10" onClick$={handleLogout}>
        Logout
      </button>
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
