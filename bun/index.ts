import { Elysia, t } from "elysia";

const port = process.env.PORT || 8080;

const app = new Elysia()
  .onRequest((props) => {
    console.log(props.request.url);
  })
  .get("/", () => "hi")
  .get("/id/:id", ({ params: { id } }) => id)
  .post("/mirror", ({ body }) => body, {
    body: t.Object({
      id: t.Number(),
      name: t.String(),
    }),
  })
  .listen(port)
  .onError(({ code, error }) => {
    return new Response(error.toString());
  });
console.log("Server started at port: " + port);
export type App = typeof app;
