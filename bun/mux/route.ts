import Elysia from "elysia";

const app = new Elysia().group("/mux", (app) => {
  return app.post("/", async ({ body }) => {
    console.log(body);
  });
});
export default app;
