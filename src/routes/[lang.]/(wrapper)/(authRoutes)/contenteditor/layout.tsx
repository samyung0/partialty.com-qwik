// export const onRequest: RequestHandler = async ({ env }) => {
//   await initTursoIfNeeded(env, !!import.meta.env.VITE_USE_PROD_DB);
//   await Promise.all([
//     initDrizzleIfNeeded(!!import.meta.env.VITE_USE_PROD_DB),
//     initLuciaIfNeeded(env, !!import.meta.env.VITE_USE_PROD_DB),
//   ]);
// };
