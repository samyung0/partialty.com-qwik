# **Readme**

## Development

Run

```html
bun i
```

```html
cd bun && bun i
```

```html
cd .. && bun run dev
```

### Switching Theme

```js
// import theme context
const layout = useContext(themeContext);
layout.value = "Theme1";
```

### Switching Layout

```js
// import layout context
const layout = useContext(layoutContext);
const loc = ueLocation();
const nav = useNavigate();
layout.value = "Layout1";

// location.reload can also be used but all states will be lost
nav(loc.url.href, {
  forceReload: true,
});
```

Now for each page under Root (excluding Root), it will try to look for the export with the layout name and render it. If the export is not found, it fallbacks to rendering default export.

### Switching Locale

- We are currently not supporting the switching of locale because we don't have enough content that is written in languages other than English. We plan to support it in the future.

- **TODO**

- **Proposal**

  - Priority: url [.lang] params > cookies

**To add a page that supports internationalization:**

Add a layout file that includes the `useSpeak({assets: ["pageName"]})`. Key in the route file should be `pageName.A.B...` and the keys in the document head should be `app.pageName.head.title` or `app.pageName.head.description`, etc.

**To add a locale:**

Edit the `lang.json` and also `qwik-speak-extract` script in package.json.

### Switching adapters

Go to `package.json` and chnage the `build.server` command, and also `index.mjs` in `api` folder.

### Customizing Qwik-city

Current: Qwik 1.3.1 (Qwik and Qwik-city should have the same version)

1. **Feat: optional param routing and allowedParams**

   In packages\qwik-city\buildtime\types.ts, in `PluginOptions`, add:

   ```ts
   allowedParams?: Record<string, string[]>;
   ```

   In packages\qwik-city\runtime\src\types.ts, in `QwikCityPlan`, add:

   ```ts
   readonly allowedParams?: Record<string, string[]>;
   ```

   In packages\qwik-city\runtime\src\qwik-city-plan.ts, add:

   ```ts
   export const allowedParams = {};
   ```

   and ensure `allowedParams` is exported like this:

   ```ts
   export default {
     routes,
     menus,
     trailingSlash,
     basePathname,
     cacheModules,
     allowedParams,
   };
   ```

   Replace packages\qwik-city\runtime\src\route-matcher with doc\qwik-city\route-matcher

   Replace packages\qwik-city\runtime\src\routing with doc\qwik-city\routing

   Replace packages\qwik-city\middleware\request-handler\request-handler with doc\qwik-city\request-handler

   In packages\qwik-city\buildtime\vite\dev-server.ts, replace `matchRouteRequest` function with the following:

   ```ts
   const matchRouteRequest = (pathname: string) => {
     for (const route of ctx.routes) {
       let params = matchRoute(route.pathname, pathname, ctx.opts.allowedParams);
       if (params) {
         return { route, params };
       }

       if (ctx.opts.trailingSlash && !pathname.endsWith("/")) {
         params = matchRoute(route.pathname, pathname + "/", ctx.opts.allowedParams);
         if (params) {
           return { route, params };
         }
       }
     }

     return null;
   };
   ```

   In scripts\api.ts, replace `referenceDts` with the following:

   ```ts
   const referenceDts = `
    declare module '@qwik-city-plan' {
      export const routes: any[];
      export const menus: any[];
      export const trailingSlash: boolean;
      export const basePathname: string;
      export const cacheModules: boolean;
      export const allowedParams = {};
      const defaultExport: {
        routes: any[];
        menus: any[];
        trailingSlash: boolean;
        basePathname: string;
        cacheModules: boolean;
        allowedParams: Record<string, string[]>
      };
      export default defaultExport;
    }
    `;
   ```

   In packages\qwik-city\buildtime\runtime-generation\generate-qwik-city-plan.ts, add the following line:

   ```ts
   c.push(`export const allowedParams = ${JSON.stringify(ctx.opts.allowedParams)};`);
   ```

   and make sure `allowedParams` is exported like this:

   ```ts
   c.push(
     `export default { routes, serverPlugins, menus, trailingSlash, allowedParams, basePathname, cacheModules };`
   );
   ```

   In packages\qwik-city\runtime\src\qwik-city-component.tsx, for every loadRoute called (should be 3 in total), add `qwikCity.allowedParams` as the last argument.

   In packages\qwik-city\utils\fs.unit.ts,<br />
   packages\qwik-city\buildtime\markdown\markdown-url.unit.ts,<br />
   packages\qwik-city\buildtime\routing\resolve-source-file.unit.ts, <br />
   whenever there is `const opts: NormalizedPluginOptions`, add the following to the object: (should have 4)

   ```ts
   allowedParams: {
   }
   ```

2. **Exposing loadClientData for manual prefetching and adding removeClientDataCache**

   In packages\qwik-city\runtime\src\use-endpoint.ts, add the @public flag before the loadClientData function declaration:

   ```js
   /** @public */
   export const loadClientData = async (...
   ```

   then add the function removeClientDataCache:

   ```js
   /** @public */
   export const removeClientDataCache = () => {
     const keys = CLIENT_DATA_CACHE.keys();
     for (const key of keys) {
       CLIENT_DATA_CACHE.delete(key);
     }
   };
   ```

   And then in packages\qwik-city\runtime\src\index.ts, add the following to export the function:

   ```js
   export { loadClientData, removeClientDataCache } from "./use-endpoint";
   ```

3. **Prefetch links on visible instead of hover**

   Prefetching links on hover is slow and have a noticeable delay. Besides, prefetching links when it enter the viewport is the default prefetching strategy for many other frameworks.

   In packages\qwik-city\runtime\src\link-component.tsx, change the if condition of `prefetchLinkResources` to:

   ```ts
   if (isOnVisible) {
     // either this is a mouseover event, probably on desktop
     // or the link is visible, and the viewport width is less than X
     loadClientData(new URL(elm.href), elm);
   }
   ```

4. **Feat: Adding in layout switching**

   We will add in a feature in router outlet that reads the layout attribute and render the page accordingly, if the child with the name identical as the layout is not exported from the route, the default child will be rendered.

   Replace packages\qwik-city\runtime\src\router-outlet-component with doc/qwik-city/router-outlet-component

   **_Check if we need to integrate any new features implemented in router outlet from qwik!!!_**

   Then in packages\qwik-city\runtime\src\types.ts, in PageModule and LayoutModule, add the following key value pair:

   ```ts
   readonly [x: string]: any;
   ```

- **Building and Pushing to Github**

  - `pnpm install` (delete all pnpm folders in user/AppData/local, remove node_modules folder and reinstall pnpm if operation not permitted error shows)
  - `pnpm api.update`
  - `npm run build.full`

  Go to qwik-city/bin and do git init and set remote main to `https://github.com/samyung0/qwikcity-dist`, then commit all files and push:

  ```git
  cd packages/qwik-city/lib
  git init
  git remote add origin https://github.com/samyung0/qwikcity-dist
  git add .
  git commit -m "init"
  git push origin main -f
  ```

  `cd packages/qwik-city/lib && git init && git remote add origin https://github.com/samyung0/qwikcity-dist && git add . && git commit -m "init" && git push origin main -f`

## Caution

- **QWIK Bugs**

  - DO NOT use `await server$()()` pattern. It only works in development mode but gives `dynamic require is not supported` error in prod.

- **Installing ElysiaJS dependencies twice**

  Since we are using typesafe api calls via edenTreaty in Bun, we need to install the dependencies used by ElysiaJS in our root folder for the typescript to pickup. However, when we are deploying the bun app, only the files inside of `bun` will be deployed (to save space since we don't need to install so many dependencies). This creates a problem where we need to install any dependency used by ElysiaJS twice: once in the root folder, and once inside of `bun` folder.

- **Cloudinary uploads and assets are all public**

  The app id of cloudinary is visible publicly but the upload present is not. Technically even unsigned requests to the api endpoints require an upload present id, it is still better to assume that anyone can upload to cloudinary at the moment. And all images that are uploaded this way can also be fetched anywhere. Signed uploads require backend Sdk which mean we need to configure both Lucia auth and Cloudinary Sdk on Bun api server.
  (https://support.cloudinary.com/hc/en-us/articles/202519742-Can-I-allow-access-to-uploaded-images-only-to-authenticated-users-[https://support.cloudinary.com/hc/en-us/articles/202519742-Can-I-allow-access-to-uploaded-images-only-to-authenticated-users-])

- **Good Practice: Do not prefetch routes that require auth**

  An issue is that if the user prefetches a route while authed, and then logouts while staying on the same page and clicks into the prefetched page, the user can visit the site as authed since Qwik already stores a version of the authed site in serialized data and it will not fetch the site data again since it is cached already.

  One of the solution is to clear the client data cache that persists route info by creating a function inside of qwik-city, and calling the function everytime there is an auth change.

- **Routing and Embedding**

  Webcontainer from stackblitz requires cross origin opener policy (COOP) header set to same-origin and cross origin embedder policy (COEP) header set to require-corp in order to establish cross origin isolation. You can go into developer tab and type in `crossOriginIsolated`. Check the effects of the headers [here](https://blog.stackblitz.com/posts/cross-browser-with-coop-coep/).

  **TL;DR**

  - new windows opened in the crossOriginIsolated route must have the same origin (domains) in order to interact with the parent window
  - whenever a video/audio/image/iframe is embedded, certain procedures needed to be done to ensure embedding is allowed
    - for iframe: either it responses with COEP require-corp, or use credentialless in the iframe tag (check [support](https://caniuse.com/mdn-html_elements_iframe_credentialless))
    - for image: use crossorigin for the img tag, or responses with COEP require-corp

  **Implications:**

  - Youtube embeds do not work on crossOriginIsolated routes (See [issue](https://issuetracker.google.com/issues/240387105) tracked)

  **Setting a route to be crossOriginIsolated:**

  - In development environment with vite, use middleware and test for the req.url
  - In production with vercel, add the headers for the relevant paths (**make sure it ends with a slash**, it's a qwik thing to redirect every route except root to one ending with slash) in vercel.json

## TODO

- **Finish up Stripe payment page**

  - Put subscription in another page other than profile
  - Show next billing date
  - Show pending cancel plan (cancelled but still active until next billing date)
  - Make a billing page
  - Show billing history

- **Configure cloudinary to store private images**

- **Responsive Design**

- **Add search to dashboard 'my courses'**

- **Use onchange from webcontainer instead of chokidar (need node v20 !!)**

- **Add browser version check**

  - web workers
  - @webcontainer/api
  - monaco

  We can then set vite compile target accordingly

- **Installing github app and fetching repo**

- **Consider switching from webcontainer to sandpack by codesandbox**

  There are currently too many problems with webcontainer, like the crossOriginIsolation, some node functionalities (async storage) not getting implemented, etc.

- **Enable dynamic import of themes**

  - and possible use a theme switcher library

- **Configure MicroVM**
  - amazon ec2?
  - we need authentication, resource mangement, microvm & docker management, socket connection (or RTC idk), theres a lot
