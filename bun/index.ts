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

import Git from "nodegit"

Git.Clone("https://github.com/nodegit/nodegit", "./tmp")
  // Look up this known commit.
  .then(function(repo) {
    // Use a known commit sha from this repository.
    return repo.getCommit("59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5");
  })
  // Look up a specific file within that commit.
  .then(function(commit) {
    return commit.getEntry("README.md");
  })
  // Get the blob contents from the file.
  .then(function(entry) {
    // Patch the blob to contain a reference to the entry.
    return entry.getBlob().then(function(blob) {
      (blob as any).entry = entry;
      return blob;
    });
  })
  // Display information about the blob.
  .then(function(blob) {
    // Show the path, sha, and filesize in bytes.
    console.log((blob as any).entry.path() + (blob as any).entry.sha() + blob.rawsize() + "b");

    // Show a spacer.
    console.log(Array(72).join("=") + "\n\n");

    // Show the entire file.
    console.log(String(blob));
  })
  .catch(function(err) { console.log(err); });

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
