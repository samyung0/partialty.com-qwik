import { component$, Slot, useContextProvider, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { type Subscription } from "@supabase/supabase-js";

// import { useRedirectLoader } from "~/routes/(wrapper)/plugin@Redirect";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { globalContext } from "~/context/globalContext";
import { defaultValue, type GlobalContextType } from "~/types/GlobalContext";
import { authStateChange, preload } from "~/utils/auth";
import { checkProtectedPath } from "~/utils/redirect";

export const useRedirectLoader = routeLoader$(async (request) => {
  // bind to the root request since request inside server$ has different request object
  const context = await preload.bind(this)();

  // userRole can be null if error
  const [shouldRedirect, redirectTo] = checkProtectedPath(
    context.req.url!.pathname,
    context.session?.userRole
  );
  if (shouldRedirect) {
    request.cookie.set("redirectedFrom", request.url.pathname, {
      path: "/",
    });
    throw request.redirect(308, redirectTo);
  }
  return context;
});

export default component$(() => {
  const preloadedContext = useRedirectLoader().value;
  const globalStore = useStore(
    Object.assign({}, defaultValue, preloadedContext, {
      isLoggedIn: preloadedContext.session ? true : false,
    }) as GlobalContextType
  );
  useContextProvider(globalContext, globalStore);
  const nav = useNavigate();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    let subscription: Subscription | null = null;

    authStateChange(globalStore, nav).then((res) => (subscription = res.data.subscription));

    cleanup(() => {
      subscription?.unsubscribe();
    });
  });

  return <Slot />;
});
