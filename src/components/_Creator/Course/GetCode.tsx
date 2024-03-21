import type { Signal } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { LuX } from "@qwikest/icons/lucide";
import { eq } from "drizzle-orm";
import { generateRandomString, isWithinExpiration } from "lucia/utils";
// import generateContentShareToken from "~/auth/generateContentShareToken";
import LoadingSVG from "~/components/LoadingSVG";
import drizzleClient from "~/utils/drizzleClient";
import { content_share_token } from "../../../../drizzle_turso/schema/content_share_token";

const EXPIRES_IN = 1000 * 60 * 30; // 30 minutes
export const generateContentShareToken = server$(async function (contentId: string) {
  const storedUserTokens = await drizzleClient(this.env)
    .select()
    .from(content_share_token)
    .where(eq(content_share_token.index_id, contentId));
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 15 minutes
      // and reuse the token if true
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    await Promise.allSettled(
      storedUserTokens
        .filter((token) => token.id !== reusableStoredToken?.id || "")
        .map(async (token) => {
          await drizzleClient(this.env)
            .delete(content_share_token)
            .where(eq(content_share_token.id, token.id));
        })
    );
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(6).toUpperCase();

  // await drizzleClient(this.env)
  //   .insert(content_share_token)
  //   .values({
  //     id: token,
  //     expires: BigInt(new Date().getTime() + EXPIRES_IN),
  //     index_id: contentId,
  //   })
  //   .returning();

  return token;
});

export default component$(
  ({ showGetCode, contentId }: { showGetCode: Signal<boolean>; contentId: string }) => {
    const isGeneratingCode = useSignal(false);
    const generatedCode = useSignal("");
    return (
      <div class="fixed left-0 top-0 z-[100] flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[95vw] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80vw] lg:w-[50vw] lg:min-w-[400px] lg:max-w-[600px]">
          <button
            onClick$={() => (showGetCode.value = false)}
            class="absolute right-5 top-5 block p-1 text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]"
          >
            <LuX />
          </button>
          <h2 class="pb-4 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem]">
            Add Chapter
          </h2>
          <div class="flex flex-col items-center justify-center gap-3">
            <button
              onClick$={async () => {
                if (isGeneratingCode.value) return;
                isGeneratingCode.value = true;
                try {
                  const code = await generateContentShareToken(contentId);
                  generatedCode.value = code;
                } catch (e) {
                  console.error(e);
                  alert("Unable to generate code. Please try again later or contact support.");
                }
                isGeneratingCode.value = false;
              }}
              class="w-[150px] rounded-md bg-primary-dark-gray px-4 py-3 text-background-light-gray "
            >
              {!isGeneratingCode.value && <span>Generate Code</span>}
              {isGeneratingCode.value && <LoadingSVG />}
            </button>
            {generatedCode.value && (
              <p class="font-mosk text-xl font-bold tracking-widest">{generatedCode.value}</p>
            )}
          </div>
          <p class="max-w-[280px] pt-4 text-center text-sm md:max-w-[400px] md:pt-6 md:text-base">
            Anyone with this code can view and edit your courses. If you don't want other people to
            edit the course, <span class="border-b-4 border-tomato dark:border-pink">lock</span> the
            course before sharing the code. <br />
            You CANNOT revoke the access later.
          </p>
        </div>
      </div>
    );
  }
);
