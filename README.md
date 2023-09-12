# Readme

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
layout.value = "Layout1";
nav(loc.url.pathname, {
  // check for search params
  forceReload: true,
});
```

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
const url = new URL(location.href);
url.searchParams.set("lang", newLocale.lang);
location.href = url.toString();
```

Locale Resolution order:

> URL search params > cookie > request header > default locale
