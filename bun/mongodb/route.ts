import Elysia from "elysia";

const app = new Elysia().group("/mongodb", (app) => {
  return app;
});
export default app;
