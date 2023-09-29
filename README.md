# **Readme**

## Development

Run

```html
npm run ci
```

```html
npm run dev
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

```js
// import speak config
const newLocale = config.supportedLocales[0] // e.g. using the first locale

// Within the app: we can call server$ and set the cookie
export const storeLocaleCookie = server$(function (lang: string) {
  this.cookie.set("lang", lang, {
    path: "/",
    maxAge: [7, "days"],
    httpOnly: false,
    sameSite: "lax",
    secure: true,
  });
});
storeLocaleCookie(newLocale.lang).then(() => location.reload());

// OR

// Outside the app, we can add a search param to the url
// LOSES all states
const url = new URL(location.href);
url.searchParams.set("lang", newLocale.lang);
location.href = url.toString();
```

Locale Resolution order:

> URL search params > cookie > request header > default locale

To add a locale, make sure you edit the `speak-config.ts` and also `qwik-speak-extract` script in package.json!

## Caution

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

- **Add browser version check**

  - web workers
  - @webcontainer/api
  - monaco

  We can then set vite compile target accordingly

- **Caching Fetched Github Data**

  When a user fetches github repo files and uploads to Cloudflare R2, the github files will permanenetly cache in the users computer. We need to allow the user to clear the cache so new content can be fetched.

- **Consider switching from webcontainer to sandpack by codesandbox**

  There are currently too many problems with webcontainer, like the crossOriginIsolation, some node functionalities (async storage) not getting implemented, etc.

- **Enable dynamic import of themes**

  - and possible use a theme switcher library

- **Configure MicroVM**
  - amazon ec2?
  - we need authentication, resource mangement, microvm & docker management, socket connection (or RTC idk), theres a lot
