import { component$ } from "@builder.io/qwik";

import LoginComponent from "~/components/_Login";

export default component$(() => {
  // const nav = useNavigate();
  // const loginWithPassword = useLoginWithPassword();
  // const params = useLocation().url.searchParams;
  // const message: any = useStore({ message: undefined, status: "error" });

  // useTask$(({ track }) => {
  //   track(() => params.get("errMessage"));
  //   message.message = params.get("errMessage");
  // });

  // useTask$(({ track }) => {
  //   track(() => loginWithPassword.status);
  //   if (loginWithPassword.status === 400)
  //     message.message = Object.values(loginWithPassword.value?.fieldErrors ?? {})
  //       .flat()
  //       .join("\n");
  //   if (loginWithPassword.status === 500) message.message = loginWithPassword.value?.message;
  //   if (loginWithPassword.status === 200) nav("/members/dashboard/");
  // });
  return <LoginComponent></LoginComponent>;
});
