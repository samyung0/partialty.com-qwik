import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const nav = useNavigate();
  const success = useLocation().url.searchParams.get("success");
  useVisibleTask$(() => {
    setTimeout(() => {
      nav("/members/dashboard/");
    }, 3000);
  });
  return (
    <main class="flex h-[100vh] w-full flex-col items-center justify-center gap-4 bg-light-yellow">
      {success === "1" ? (
        <>
          <h1 class="font-mosk text-[2.5rem] font-bold">
            Your purchase has been <span class="highlight-mint">completed.</span>
          </h1>
          <p>You will be redirected to your dashboard in a few seconds.</p>
        </>
      ) : (
        <>
          <h1 class="font-mosk text-[2.5rem] font-bold">
            Your purchase has been <span class="highlight-middle-tomato">cancelled.</span>
          </h1>
          <p>You will be redirected to your dashboard in a few seconds.</p>
        </>
      )}
    </main>
  );
});
