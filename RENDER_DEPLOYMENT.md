# Render Deployment

DoinkTV is a single Node web service. Render should run it with:

- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/api/health`
- Node version: `22.16.0`

The app reads `process.env.PORT`, which Render provides automatically.

## First Test Deploy

1. Push this repo to GitHub.
2. In Render, create a new Web Service from the repo, or use the included `render.yaml` blueprint.
3. Keep the root directory as the repository root.
4. Deploy and open the generated `onrender.com` URL.
5. Check `/api/health` and `/api/program` after deploy.

## Notes

- `media/bump-music` is committed for the live test, so schedule bump music is available immediately.
- `data/state.json` is committed as starter state. Without a Render disk, edits made in admin mode can reset on redeploy or service restart.
- For a longer-running test, add a Render persistent disk and set `DOINK_DATA_DIR` to the mounted data directory.
- The BumpGenerator is vendored in `vendor/BumpGenerator` so `/bumpgenerator` works on Render without needing the sibling project directory.
