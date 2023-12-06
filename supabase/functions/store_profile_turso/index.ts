import { createClient } from "https://esm.sh/@libsql/client/web";

const prod = createClient({
  url: Deno.env.get("TURSO_PROD_URL"),
  authToken: Deno.env.get("TURSO_PROD_TOKEN"),
});

const dev = createClient({
  url: Deno.env.get("TURSO_DEV_URL"),
  authToken: Deno.env.get("TURSO_DEV_TOKEN"),
});

Deno.serve(async (req) => {
  const json = await req.json();
  console.log("data:", json);

  if (json.type === "DELETE" && !json.old_record) {
    throw new Error("Old record missing!");
  }

  const data = json.type === "DELETE" ? json.old_record : json.record;

  if (json.type !== "DELETE") {
    if (!data.id) {
      throw new Error("Id missing!");
    }

    if (!data.created_at) {
      throw new Error("Creation date missing!");
    }

    if (data.email === "") {
      throw new Error("Email missing!");
    }
  }

  const record = {
    id: data.id,
    created_at: data.created_at,
    email: data.email,
    phone: data.phone,
    last_sign_in_at: data.last_sign_in_at,
  };

  if (json.type === "INSERT") {
    try {
      await Promise.all([
        prod.execute({
          sql: "insert into profiles (id, created_at, email, phone, last_signed_in) values ($id, $created_at, $email, $phone, $last_sign_in_at);",
          args: { ...record },
        }),
        dev.execute({
          sql: "insert into profiles (id, created_at, email, phone, last_signed_in) values ($id, $created_at, $email, $phone, $last_sign_in_at);",
          args: { ...record },
        }),
      ]);
    } catch (e) {
      console.error(e);
      return new Response("database insert failed");
    }
  } else if (json.type === "DELETE") {
    try {
      await Promise.all([
        prod.execute({
          sql: "delete from profiles where id=$id;",
          args: { id: record.id },
        }),
        dev.execute({
          sql: "delete from profiles where id=$id;",
          args: { id: record.id },
        }),
      ]);
    } catch (e) {
      console.error(e);
      return new Response("database delete failed, id: ", record.id);
    }
  } else if (json.type === "UPDATE") {
    try {
      await Promise.all([
        prod.execute({
          sql: "update profiles set email=$email, phone=$phone, created_at=$created_at, last_signed_in=$last_sign_in_at where id=$id;",
          args: { ...record },
        }),
        dev.execute({
          sql: "update profiles set email=$email, phone=$phone, created_at=$created_at, last_signed_in=$last_sign_in_at where id=$id;",
          args: { ...record },
        }),
      ]);
    } catch (e) {
      console.error(e);
      return new Response("database delete failed, id: ", data.id);
    }
  }

  return new Response("OK");
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
