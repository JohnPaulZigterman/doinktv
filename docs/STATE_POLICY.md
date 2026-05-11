# DoinkTV State Policy

This project keeps a checked-in starter state, but the running station should write to runtime storage. Treat the repo as the station blueprint and the runtime data directory as the living station.

## Committed Defaults

- `data/state.json`: starter/seed state for a fresh checkout or deployment. Keep this useful, small enough to review, and free of machine-specific runtime churn.
- `media/`: owned server-side media that should ship with the station, including curated soundboard files and default local bump assets.
- `public/`, `lib/`, `vendor/`, `test/`: application code, client assets, helper modules, and policy tests.

## Runtime State

These should not be committed:

- `data/runtime/state.json`: live admin edits, generated schedules, queue state, registered users, lore/community edits, FX snapshots, continuity log, fade-break cache, and source ingest state.
- `data/hls/`: generated HLS playlists and segments.
- `data/server*.log`: local server logs.

For production, mount persistent storage and set:

```text
DOINK_DATA_DIR=/path/to/persistent/data
```

or set the state file directly:

```text
DOINK_STATE_PATH=/path/to/persistent/state.json
```

Use `DOINK_HLS_DIR` only when HLS output needs a separate fast scratch volume.

## Cache-Like Data

Some runtime state is useful but reproducible:

- Fade-break detections in `fadeBreaks`.
- Weather bump entries and recent weather choices.
- Generated weekly schedule entries and generated block promo sources.
- Source ingest check results.

Keep these in runtime state for operation, but do not move them back into the starter file unless they are intentional defaults.

## Deployment Rules

- Set `ADMIN_USER` and `ADMIN_PASSWORD` before public deployment.
- Keep `data/runtime/` and `data/hls/` ignored.
- Back up the production `DOINK_STATE_PATH` before large scheduler, source-library, or account changes.
- When preparing a public seed, copy only deliberate defaults into `data/state.json`; do not copy the whole production runtime file.
