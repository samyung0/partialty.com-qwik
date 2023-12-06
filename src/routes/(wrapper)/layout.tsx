import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type Subscription } from "@supabase/supabase-js";

// import { useRedirectLoader } from "~/routes/(wrapper)/plugin@Redirect";
import { routeLoader$ } from "@builder.io/qwik-city";
import { defaultValue, type GlobalContextType } from "~/types/GlobalContext";
import { authStateChange, preload } from "~/utils/auth";
import { loadPublicData } from "~/utils/publicActions";
import { checkProtectedPath } from "~/utils/redirect";

export const globalContext = createContextId<GlobalContextType>("global");

export const useRedirectLoader = routeLoader$(async (request) => {
  // bind to the root request since request inside server$ has different request object
  const context = await preload();

  // userRole can be null if error
  const [shouldRedirect, redirectTo] = checkProtectedPath(
    context.req.url!.pathname,
    context.session?.userRole
  );
  if (shouldRedirect) throw request.redirect(308, redirectTo);
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

  useVisibleTask$(async ({ cleanup }) => {
    let subscription: Subscription | null = null;

    authStateChange(globalStore).then((res) => (subscription = res.data.subscription));

    loadPublicData().then((res) => {
      console.log("loaded public data ", res);
      globalStore.publicData.data = res;
    });

    cleanup(() => {
      subscription?.unsubscribe();
    });
  });

  return <Slot />;
});
