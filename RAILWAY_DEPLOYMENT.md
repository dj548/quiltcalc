# QuiltCalc - Railway Deployment Guide

This guide documents exactly what is needed to deploy the QuiltCalc React Native/Expo web app to Railway.

## Project Structure

```
quiltcalc/
├── QuiltCalc/              # Main app directory (set as Root Directory in Railway)
│   ├── App.js              # Main React Native application
│   ├── package.json        # Dependencies and scripts
│   ├── package-lock.json   # Locked dependency versions
│   ├── app.json            # Expo configuration
│   └── assets/             # Images and static files
├── nixpacks.toml           # Railway build configuration (REQUIRED)
└── vercel.json             # Alternative deployment config (not used for Railway)
```

## Required Configuration Files

### 1. nixpacks.toml (Root of Repository)

This is the **primary configuration file** for Railway deployment. It must be at the repository root.

```toml
[phases.setup]
nixPkgs = ['nodejs-18_x']

[phases.install]
cmds = ['npm install']

[phases.build]
cmds = ['npx expo export --platform web']

[start]
cmd = 'npx serve dist --listen 0.0.0.0:${PORT:-8081} --single'
```

**Key Points:**
- Uses Node.js 18.x
- `npm install` runs in the QuiltCalc directory (because of Root Directory setting)
- `expo export` creates static web build in `dist/` directory
- `serve` package serves the static files
- **CRITICAL**: Must bind to `0.0.0.0:${PORT}` for Railway's reverse proxy to work
- `--single` flag enables SPA routing (redirects all routes to index.html)

### 2. package.json (QuiltCalc/package.json)

Must include the `serve` package as a dependency:

```json
{
  "dependencies": {
    "serve": "^14.2.1",
    // ... other dependencies
  },
  "scripts": {
    "build:web": "npx expo export --platform web",
    "serve": "npx serve dist -p $PORT"
  }
}
```

### 3. package-lock.json (QuiltCalc/package-lock.json)

**MUST be in sync with package.json** - Railway uses `npm ci` which requires exact version matching.

If you add/remove dependencies:
```bash
cd QuiltCalc
npm install  # This updates package-lock.json
git add package.json package-lock.json
git commit -m "Update dependencies"
```

## Railway Project Configuration

### Step 1: Create New Project
1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository (e.g., `dj548/quiltcalc`)

### Step 2: Critical Settings

Navigate to **Settings** in your Railway project:

#### Root Directory
- **Setting**: `QuiltCalc`
- **Why**: The app code is in a subdirectory, not the repo root
- **Location**: Settings → General → Root Directory

#### Build Settings
- **Builder**: Nixpacks (should auto-detect from nixpacks.toml)
- **Build Command**: (leave empty - uses nixpacks.toml)
- **Start Command**: (leave empty - uses nixpacks.toml)

#### Environment Variables
- **DO NOT** manually set a `PORT` variable
- Railway automatically provides `PORT` - our start command uses `${PORT}`

### Step 3: Networking/Domains

1. Go to **Settings** → **Networking**
2. Click **Generate Domain** (if not already generated)
3. Railway will create a public URL like: `https://quiltcalc-production.up.railway.app`
4. **Do NOT** manually specify a port - Railway handles this internally

## Deployment Process

### Automatic Deployment

Every push to the `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Your changes"
git push
```

Railway will:
1. Clone your repository
2. Navigate to `QuiltCalc/` directory (Root Directory setting)
3. Run `npm install` (installs all dependencies including `serve`)
4. Run `npx expo export --platform web` (builds static files to `dist/`)
5. Start server with `npx serve dist --listen 0.0.0.0:${PORT} --single`

### Manual Deployment

If auto-deploy is off:
1. Go to **Deployments** tab in Railway
2. Click **Deploy** → **Deploy Latest Commit**

## Common Issues & Solutions

### Issue 1: "npm command not found"
**Symptom**: Build fails with `/bin/bash: line 1: npm: command not found`

**Solution**: Ensure `nixpacks.toml` has:
```toml
[phases.setup]
nixPkgs = ['nodejs-18_x']
```

### Issue 2: "npm ci" errors about package-lock.json
**Symptom**:
```
npm error Missing: serve@14.2.5 from lock file
```

**Solution**: Update package-lock.json
```bash
cd QuiltCalc
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Issue 3: 502 Bad Gateway
**Symptom**: Deployment succeeds but website shows 502 error

**Solution**: Ensure start command binds to `0.0.0.0`:
```toml
cmd = 'npx serve dist --listen 0.0.0.0:${PORT:-8081} --single'
```
NOT localhost or 127.0.0.1!

### Issue 4: Expo package compatibility warnings
**Symptom**: Build shows warnings about mismatched package versions

**Solution**: Update Expo packages
```bash
cd QuiltCalc
npx expo install --fix
git add package.json package-lock.json
git commit -m "Update Expo packages"
git push
```

### Issue 5: Old deployment cached
**Symptom**: Changes don't appear after deployment

**Solution**:
1. Go to Railway deployment logs
2. Verify the commit SHA matches your latest push
3. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
4. Or trigger manual redeploy in Railway dashboard

## Technology Stack

- **Framework**: React Native (Expo SDK 53)
- **Platform**: Expo Web (static export)
- **Build Tool**: Expo CLI
- **Server**: `serve` (static file server)
- **Deployment**: Railway (Nixpacks builder)
- **Node Version**: 18.x

## Build Output

After successful build, the `dist/` directory contains:
```
dist/
├── _expo/
│   └── static/js/web/
│       └── index-[hash].js
├── assets/
│   ├── CW.png
│   └── MaterialCommunityIcons.ttf
├── index.html
├── favicon.ico
└── metadata.json
```

This is served as a static website by the `serve` package.

## Monitoring

### View Deployment Logs
1. Go to **Deployments** tab
2. Click on latest deployment
3. View **Deploy Logs** (build process) and **Application Logs** (runtime)

### Check Application Status
- Look for: `INFO  Accepting connections at http://0.0.0.0:[PORT]`
- This confirms the server started successfully

## Performance Notes

- **Build Time**: ~2-3 minutes
- **Deploy Time**: ~30 seconds after build
- **Bundle Size**: ~1.16 MB (minified JavaScript)
- **Static Assets**: ~1.2 MB (fonts, images)

## Future Deployments

For subsequent apps, simply:
1. Copy `nixpacks.toml` to your repo root
2. Add `serve` to dependencies
3. Set Root Directory in Railway settings
4. Ensure start command binds to `0.0.0.0:${PORT}`

---

**Live URL**: https://quiltcalc-production.up.railway.app

**Last Updated**: 2025-10-27
