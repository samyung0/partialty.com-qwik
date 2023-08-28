// if (process.env["NODE_ENV"] !== "production") await import("dotenv/config");

// access variables from process.env using process.env["key"]
// do not directly import from this file because it will show process is not defined
// instead do it through envContext
// SUPABASE_URL and SUPABASE_SECRET_KEY should not be accessed in client side
export const SUPABASE_URL = process.env["SUPABASE_URL"];
export const SUPABASE_SECRET_KEY = process.env["SUPABASE_SECRET_KEY"];

// export const REDIRECT_URL =
//   process.env["NODE_ENV"] === "production"
//     ? process.env["VERCEL_PROD"]
//       ? "https://qwik-project.vercel.app/"
//       : "https://qwik-project-ezvnucovp-samyung0.vercel.app/"
//     : "http://localhost:5173/";
