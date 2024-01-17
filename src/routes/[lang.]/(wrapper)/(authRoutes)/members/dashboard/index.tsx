import { $, component$ } from "@builder.io/qwik";
import { removeClientDataCache, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { logout } from "~/auth/logout";

import Dashboard from "~/components/_Dashboard";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";

export default component$(() => {
  const nav = useNavigate();
  const user = useUserLoader();

  const handleLogout = $(async () => {
    await logout();
    removeClientDataCache();
    nav("/");
  });

  return (
    <main class="">
      <Dashboard user={user.value}></Dashboard>
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
