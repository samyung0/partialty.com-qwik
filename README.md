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

## TODO

- **Add browser version check**
  - web workers
  - @webcontainer/api
  - monaco

We can then set vite compile target accordingly
