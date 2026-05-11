# DoinkTV Operator Checklist

Use this before the first public launch and before any bigger promoted stream.

## Start

1. Confirm production environment variables:
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `DOINK_DATA_DIR` or `DOINK_STATE_PATH`
2. Start the service.
3. Open `/api/health` and confirm `ok: true`.
4. Open the site as a viewer and confirm the TV frame loads with a current or standby program.
5. Log in as admin and check Station health.
6. Confirm HLS status is `running`.
7. Confirm State is `configured` in production.

## Before Going Public

1. Watch the stream for at least 30 minutes.
2. Confirm at least one program-to-bump or bump-to-program handoff feels clean.
3. Toggle Peace mode as a viewer.
4. Launch Clean signal from the admin cockpit.
5. Try one mild FX scene and confirm it decays or clears.
6. Open Schedule, Queue, Board, FX, Lore, and Bumps once.
7. Run an Archive discovery audit for a risky search term and check the rejection reasons.

## Backup

Back up the live runtime state before major changes:

```powershell
Copy-Item $env:DOINK_STATE_PATH "$env:DOINK_STATE_PATH.$(Get-Date -Format yyyyMMdd-HHmmss).bak"
```

If using `DOINK_DATA_DIR` instead of `DOINK_STATE_PATH`, back up:

```powershell
Copy-Item "$env:DOINK_DATA_DIR\runtime\state.json" "$env:DOINK_DATA_DIR\runtime\state.$(Get-Date -Format yyyyMMdd-HHmmss).bak"
```

## Stop

Use the platform stop/restart control in production. Locally, stop the Node process that is listening on port 3000, then start `npm start` again.
