# Game Porting Tools

## 1. Port Games (`port-game.js`)

Port games from tag2game.github.io with automatic thumbnail downloads.

### Usage

```bash
# Port all games from GitHub (with thumbnails)
node scripts/port-game.js

# Port without downloading thumbnails (faster)
node scripts/port-game.js --no-thumbnails

# Download thumbnails for already ported games
node scripts/port-game.js --thumbnails-only

# Port specific local files
node scripts/port-game.js --local path/to/slope.html
```

### What it does

- Fetches games from GitHub or reads local HTML files
- Extracts iframe URLs, titles, and thumbnails
- Creates game folders with index.html and metadata.json
- Downloads thumbnails automatically
- Updates `src/lib/utils/games.ts`

---

## 2. Localize Games (`localize-games.js`)

⚠️ **Note:** Currently embeds HTML only. For full offline support with all assets (JS/CSS/images), keep games as iframes pointing to external sources, or manually download and host assets.

### Usage

```bash
# Localize all games (embeds HTML content)
node scripts/localize-games.js --all

# Localize specific games
node scripts/localize-games.js slope tag-2 moto-x3m

# Restore original iframe versions
node scripts/localize-games.js --restore --all
node scripts/localize-games.js --restore slope tag-2
```

### What it does

- Downloads the HTML content from iframe URLs
- Embeds content directly (removes iframe)
- Backs up original files as `index.html.backup`
- Can restore from backup with `--restore`

### Limitations

- Only embeds HTML content
- External assets (JS, CSS, images) still load from original URLs
- Games still need internet for full functionality
- Some games may not work due to CORS or missing assets

### Why keep iframes?

For most use cases, keeping the iframe is better because:
- ✅ Games work immediately
- ✅ No asset download needed
- ✅ Automatic updates from source
- ✅ No CORS issues

---

## Complete Workflow

```bash
# Step 1: Port all games
node scripts/port-game.js

# Step 2: Make them fully local (optional but recommended)
node scripts/localize-games.js --all

# Done! All games are now fully offline and unblocked
```
