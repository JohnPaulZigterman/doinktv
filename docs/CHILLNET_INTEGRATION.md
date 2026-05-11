# Chillnet Integration Handoff

This repo is ready to run as its own DoinkTV service and be integrated from `chillnet.me`.

## Recommended Setup

Deploy DoinkTV as a standalone web service, then link or embed it from Chillnet:

```html
<a href="https://YOUR-DOINKTV-HOST.example" target="_blank" rel="noopener noreferrer">
  Watch DoinkTV
</a>
```

For an embedded station window:

```html
<iframe
  src="https://YOUR-DOINKTV-HOST.example/"
  title="DoinkTV"
  loading="lazy"
  allow="autoplay; fullscreen; encrypted-media"
  style="width:100%; aspect-ratio:16/9; border:0;"
></iframe>
```

This is the lowest-risk integration because chat, voting, stream playback, bump generator access, admin login, and the full TV frame remain owned by DoinkTV.

## Public Status API

Chillnet can also fetch public status data:

```js
const program = await fetch("https://YOUR-DOINKTV-HOST.example/api/program")
  .then((response) => response.json());

const health = await fetch("https://YOUR-DOINKTV-HOST.example/api/health")
  .then((response) => response.json());
```

The service allows browser reads from:

- `https://chillnet.me`
- `https://www.chillnet.me`

Override this with:

```text
PUBLIC_API_ORIGINS=https://chillnet.me,https://www.chillnet.me
```

## Direct HLS Player

If Chillnet builds its own player, use:

```text
https://YOUR-DOINKTV-HOST.example/stream/live.m3u8
```

The HLS playlist and segments also send CORS headers for the allowed public origins.

## Important Notes

- For interactive accounts inside a cross-site iframe, browser third-party cookie rules can be inconsistent. A full-page link or same-site reverse proxy is more reliable for login, chat, voting, and admin use.
- Do not expose admin endpoints through Chillnet. Keep admin operation on the DoinkTV host.
- Production needs `ADMIN_USER`, `ADMIN_PASSWORD`, and persistent `DOINK_DATA_DIR` or `DOINK_STATE_PATH`.
- Run `docs/OPERATOR_CHECKLIST.md` before handing the URL to public visitors.

## Smoke Test For Chillnet

From a browser console on `https://chillnet.me`, test:

```js
await fetch("https://YOUR-DOINKTV-HOST.example/api/health").then(r => r.json())
await fetch("https://YOUR-DOINKTV-HOST.example/api/program").then(r => r.json())
```

Expected:

- `/api/health` returns `ok: true`.
- `/api/program` returns the current `live` and `next` programming payload.
- The iframe or direct HLS player begins playback after normal browser autoplay rules are satisfied.
