import { $, component$, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ButtonStd } from "~/components/ui/button-std";
import { Logo } from "../logo/logo";

import { globalContext } from "~/context/globalContext";
import { DBLogout } from "~/utils/auth";

// import { themeContext } from "~/root";

export const Navigation = component$(() => {
  // const nav = useNavigate();
  const context = useContext(globalContext);
  // const theme = useContext(themeContext);

  const handleLogout = $(() => {
    DBLogout();
  });

  return (
    <nav
      // data-theme="dark"
      // class="theme-test:bg-green-100 sticky bg-red-700 px-7 py-4 dark:bg-blue-100" // IMPORTANT: theme-test: will override normal styles
      // class={
      //   "sticky top-0 bg-red-700 px-7 py-4 dark:bg-blue-100 " +
      //   (theme.value === "theme-test" ? "bg-green-100 px-[70px] py-[100px]" : "")
      // }
      class="sticky top-0 z-10 bg-white px-7 py-4"
    >
      <div class="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div class="flex items-center text-sm">
          <ul class="flex space-x-10">
            <li>
              <Link prefetch href="/about">
                About
              </Link>
            </li>
            <li>
              <Link prefetch href="/shop">
                Shop
              </Link>
            </li>
            <li>
              <Link prefetch href="/services">
                Services
              </Link>
            </li>
          </ul>
          <div class="ml-10 h-10 border-r border-gray-300"></div>

          {context.isLoggedIn && (
            <>
              <button onClick$={handleLogout} class="ml-10">
                Logout
              </button>
              <Link prefetch href="/members/dashboard">
                <ButtonStd
                  title="Dashboard"
                  classText="mr-5 ml-10 bg-sky-500 border border-sky-500 hover:bg-sky-400 text-white"
                />
              </Link>
            </>
          )}

          {!context.isLoggedIn && (
            <>
              <Link prefetch href="/login">
                <ButtonStd
                  title="Log In"
                  classText="mr-2 ml-10 border border-sky-500 text-sky-500 hover:text-sky-400 hover:border-sky-400"
                  noBackground
                />
              </Link>
              <Link prefetch href="/signup">
                <ButtonStd
                  title="Sign Up"
                  classText="mr-5 ml-5 bg-green-500 border border-green-500 hover:bg-green-400 text-white"
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});
