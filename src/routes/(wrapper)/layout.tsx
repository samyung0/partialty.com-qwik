import {
  component$,
  Slot,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type Subscription } from "@supabase/supabase-js";
import { globalContext } from "~/root";
import { authStateChange } from "~/routes/plugin@Auth";
import { loadPublicData } from "~/routes/plugin@PublicActions";

export default component$(() => {
  const context = useContext(globalContext);
  useVisibleTask$(async ({ cleanup }) => {
    let subscription: Subscription | null = null;

    authStateChange(context).then(
      (res) => (subscription = res.data.subscription)
    );

    context.publicData.initiated = true;
    loadPublicData().then((res) => {
      console.log("loaded public data ", res);
      context.publicData.data = res;
      context.publicData.initiated = false;
      context.publicData.resolved = true;
    });

    cleanup(() => {
      subscription?.unsubscribe();
    });
  });

  return <Slot />;
});
