import { server$ } from "@builder.io/qwik-city";

export default server$(async function (token: string) {
  return await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${this.env.get(
      "GOOGLE_RECAPTCHA_V3_SECRET"
    )!}&response=${token}`,
    {
      method: "POST",
    }
  ).then((x) => x.json());
});
