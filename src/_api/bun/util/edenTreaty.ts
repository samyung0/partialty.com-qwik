import { edenTreaty } from "@elysiajs/eden";
import { BUN_API_ENDPOINT } from "~/const";
import type { App } from "../../../../bun/index";

const bunApp = edenTreaty<App>(
  import.meta.env.MODE === "production" ? BUN_API_ENDPOINT : "http://localhost:8080"
);

export default bunApp;
