import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type Subscription } from "@supabase/supabase-js";

import { authStateChange } from "~/utils/auth";
import { loadPublicData } from "~/utils/publicActions";
import { useRedirectLoader } from "~/routes/plugin@Redirect";
import { defaultValue } from "~/types/GlobalContext";
import { type GlobalContextType } from "~/types/GlobalContext";

export const globalContext = createContextId<GlobalContextType>("global");

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

    globalStore.publicData.initiated = true;
    loadPublicData().then((res) => {
      console.log("loaded public data ", res);
      globalStore.publicData.data = res;
      globalStore.publicData.initiated = false;
      globalStore.publicData.resolved = true;
    });

    cleanup(() => {
      subscription?.unsubscribe();
    });
  });

  return <Slot />;
});
