# Deploying Autonomaton to the-grove.ai

The Autonomaton demo is hosted at **https://the-grove.ai/autonomaton**

## Quick Deploy

**Windows:**
```cmd
deploy.bat "feat: Add new feature X"
```

**Mac/Linux:**
```bash
./deploy.sh "feat: Add new feature X"
```

If no commit message provided, defaults to "chore: Update Autonomaton demo"

## What the Script Does

1. **Builds** — Runs `npm run build` (Vite production build)
2. **Copies** — Moves `dist/` to `../the-grove-foundation/autonomaton/`
3. **Commits** — Stages and commits the changes
4. **Pushes** — Pushes to `main`, triggering Cloud Build

## Manual Deploy Steps

If the script doesn't work, do it manually:

```bash
# 1. Build
npm run build

# 2. Copy to grove-foundation
rm -rf ../the-grove-foundation/autonomaton
cp -r dist ../the-grove-foundation/autonomaton

# 3. Commit and push
cd ../the-grove-foundation
git add autonomaton/
git commit -m "chore: Update Autonomaton demo"
git push origin main
```

## Architecture

```
grove-autonomaton-example/     ← This repo (source)
├── src/
├── dist/                      ← Built files
├── deploy.sh                  ← Deploy script (Mac/Linux)
├── deploy.bat                 ← Deploy script (Windows)
└── vite.config.ts             ← base: '/autonomaton/'

the-grove-foundation/          ← Production repo
├── autonomaton/               ← Copied from dist/
├── server.js                  ← Routes /autonomaton to autonomaton/
├── Dockerfile                 ← Includes autonomaton/ in image
└── cloudbuild.yaml            ← Triggers on push to main
```

## How Routing Works

In `the-grove-foundation/server.js`:

```javascript
// Static files
app.use('/autonomaton', express.static(path.join(__dirname, 'autonomaton')));

// SPA fallback (before main catch-all)
app.get('/autonomaton/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'autonomaton', 'index.html'));
});
```

## Timeline

- Push to main → Cloud Build triggers (~10 sec)
- Docker build + deploy → ~3-5 minutes
- Live at https://the-grove.ai/autonomaton

## Troubleshooting

**Build fails:** Check `npm run build` output for TypeScript errors

**No changes detected:** The script skips if autonomaton/ hasn't changed

**Cloud Build fails:** Check Google Cloud Console → Cloud Build → History
