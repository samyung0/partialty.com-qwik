import { component$, Slot } from '@builder.io/qwik';
import Nav from '~/components/Nav';
import { NavLink } from '~/components/NavLink';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';

export default component$(() => {
  const user = useUserLoader().value;

  return (
    <section class="min-h-[100vh] bg-light-yellow dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav user={user} />
      <div class="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:flex-row lg:px-8 lg:pt-6">
        <div class="flex w-full flex-col gap-4 lg:w-[20%]">
          <div class="hidden self-center lg:block">
            <img class="h-[100px] w-[100px] rounded-full object-cover" src={user.avatar_url} width={100} height={100} />
            <p class="p-1 text-center font-mosk text-lg tracking-wide">{user.nickname}</p>
          </div>
          <div class="flex w-full flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0">
            <div class="relative flex h-full gap-1">
              <NavLink
                class={`relative w-full text-left before:absolute before:right-[calc(100%+4px)] before:top-0 before:hidden before:h-full before:w-[5px] before:rounded-lg  [&>span]:hover:brightness-90 dark:[&>span]:hover:brightness-150`}
                activeClass="[&>span]:brightness-90 [&>span]:dark:brightness-150 before:block before:bg-custom-yellow"
                href="/admin/courseapproval/"
              >
                <span class="block rounded-md bg-light-yellow p-3 dark:bg-primary-dark-gray  lg:p-2">
                  Course Approval
                </span>
              </NavLink>
            </div>
          </div>
        </div>
        <div class="mt-[30px] w-full ">
          <Slot />
        </div>
      </div>
    </section>
  );
});
