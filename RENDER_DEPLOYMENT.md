# Render Deployment

DoinkTV is a single Docker web service. Render should build it from `Dockerfile` so FFmpeg is available for HLS playout.

- Runtime: Docker
- Dockerfile path: `./Dockerfile`
- Docker context: `.`
- Health check path: `/api/health`
- Node version: `22.16.0`

The app reads `process.env.PORT`, which Render provides automatically. The Docker image installs FFmpeg for `/stream/live.m3u8` generation.

## First Test Deploy

1. Push this repo to GitHub.
2. In Render, create a new Web Service from the repo, or use the included `render.yaml` blueprint.
3. Keep the root directory as the repository root.
4. Deploy and open the generated `onrender.com` URL.
5. Check `/api/health` and `/api/program` after deploy.

## Notes

- `media/bump-music` is committed for the live test, so schedule bump music is available immediately.
- `data/state.json` is committed as starter state. Runtime edits should live in ignored persistent storage; see `docs/STATE_POLICY.md`.
- For a longer-running test, add a Render persistent disk and set `DOINK_DATA_DIR` to the mounted data directory. Set `ADMIN_USER` and `ADMIN_PASSWORD` before public deployment.
- The BumpGenerator is vendored in `vendor/BumpGenerator` so `/bumpgenerator` works on Render without needing the sibling project directory.
- Viewers consume a single HLS feed at `/stream/live.m3u8`. YouTube sources must be ingested as server media before they can appear in that shared feed.
