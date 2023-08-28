# Readme

## Development

Run

```html
npm run i npm run dev
```

~~In node_modules\@builder.io\qwik\optimizer.cjs after line 2472, before new URL, add~~

```html
req.url = "/" + req.url.split("/").filter(x => x !== "").join("/")
```

~~In node_modules\@builder.io\qwik-city\vite\index.cjs after line 25563, before new URL, add~~

```html
req.originalUrl = "/" + req.originalUrl.split("/").filter(x => x !== "").join("/")
```

## TypeSafes

The api endpoints are typesafe, but types are lost once the data get stored in the global context.

## Data Fetching

The Database Data are only fetched in client side after session is live.
For the publicly available data, it is fetched as soon as the client makes a request to the server, and made available when the client decides to resolve the api calls.

## Error During Development

```html
Error [ERR_STREAM_DESTROYED]: Cannot call write after a stream was destroyed
```

happens when you refreshes the page while fetching public data, the server tries to send a respond to the client but the connection is ended, resulting in an error. Currently, qwik does not provide a way to handle this error internally.
