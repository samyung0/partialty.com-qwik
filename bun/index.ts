import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { Elysia } from "elysia";
import { compression } from "elysia-compression";
import { helmet } from "elysia-helmet";
// import { ip } from "elysia-ip";
import { rateLimit } from "elysia-rate-limit";
import AuthRoute from "./auth/route";
import MuxRoute from "./contentEditor/route";
import EmailRoute from "./email/route";
import HealthRoute from "./health/route";
import StripeRoute from "./stripe/route";

const port = process.env.PORT || 8080;
const allowedDomains = [/^https:\/\/(.*\.)?partialty\.com$/, /http:\/\/localhost:.*/];

import simpleGit from "simple-git"
import { readdirSync } from "node:fs";


simpleGit()
.clone(`https://github.com/samyung0/Template_react_1`)
.then(async () => {
     const dir = readdirSync("./Template_react_1")
     console.log(dir)
   })
   .catch((err) => console.error('failed: ', err));

const app = new Elysia()
  // .use(ip())
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");
        if (!origin) return false;
        for (const domain of allowedDomains) if (domain.test(origin)) return true;
        return false;
      },
    })
  )
  .use(
    rateLimit({
      max: 20,
    })
  )
  .use(
    cron({
      name: "heartbeat",
      pattern: "* */14 * * * *", // render apps sleep every 15 minutes
      run() {
        try {
          fetch("https://api.partialty.com");
        } catch (e) {}
      },
    })
  )
  .use(
    cron({
      name: "heartbeat2",
      pattern: "* */15 * * * *", // avoid cold start in vercel for root
      run() {
        try {
          // put the major sites here
          fetch("https://www.partialty.com/");
          fetch("https://www.partialty.com/contenteditor/");
          fetch("https://www.partialty.com/members/dashboard/");
          fetch("https://www.partialty.com/signup/");
          fetch("https://www.partialty.com/login/");
        } catch (e) {}
      },
    })
  )
  .use(compression())
  .use(helmet())
  .use(HealthRoute)
  .use(AuthRoute)
  .use(EmailRoute)
  .use(MuxRoute)
  .use(StripeRoute)
  .post("/idk", ({ body }) => {
    console.log(body);
  })
  .listen(port)
  .onError(({ code, error }) => {
    return new Response(error.toString());
  });

console.log("Server started at port: " + port);
export type App = typeof app;
