import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div>
      <Link href="/members/dashboard/">Dashboard</Link>
    </div>
  );
});
