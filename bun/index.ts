import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { Elysia } from "elysia";
import { compression } from "elysia-compression";
import { helmet } from "elysia-helmet";
import { ip } from "elysia-ip";
import { rateLimit } from "elysia-rate-limit";
import AuthRoute from "./auth/route";
import HealthRoute from "./health/route";

const port = process.env.PORT || 8080;
const allowedDomains = [/^https:\/\/(.*\.)?partialty\.com$/, /http:\/\/localhost:.*/];

const app = new Elysia()
  .use(ip())
  .use(
    rateLimit({
      duration: 10000,
    })
  )
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
  // .use(ip()) //currently does not have any types
  .use(
    cron({
      name: "heartbeat",
      pattern: "* */14 * * * *", // render apps sleep every 15 minutes
      run() {
        fetch("http://api.partialty.com");
      },
    })
  )
  .use(compression())
  .use(helmet())
  .use(HealthRoute)
  .use(AuthRoute)
  .listen(port)
  .onError(({ code, error }) => {
    return new Response(error.toString());
  });

console.log("Server started at port: " + port);
export type App = typeof app;
