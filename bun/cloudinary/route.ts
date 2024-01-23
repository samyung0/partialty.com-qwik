import Elysia from "elysia";

// cloudinary.v2.config({
//   cloud_name: "dhthx6tn6", // add your cloud_name
//   api_key: "481979412439269", // add your api_key
//   api_secret: "fbC-9JIyviW_SM-vus-V0i5r26Q", // add your api_secret
//   secure: true
//  });

const app = new Elysia().group("/cloudinary", (app) => {
  return app;
});
export default app;
