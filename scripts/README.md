# Game Porting Tools

## Quick Start - Port Everything!

```bash
# Port games from ALL open-source platforms at once
node scripts/port-all-opensource.js

# Then update the games list
node scripts/generate-games-list.js
```

---

## Open Source Game Porters

### 1. GitHub Games (`port-github-games.js`)

Port individual open-source HTML5 games from GitHub repositories. Downloads full source code for offline play.

```bash
node scripts/port-github-games.js
```

**Sources:** 2048, Tetris, Flappy Bird, Duck Hunt, A Dark Room, Hextris, and more!

### 2. js13kGames (`port-js13k-games.js`)

Port ultra-small (13KB) JavaScript games from the js13kGames competition.

```bash
node scripts/port-js13k-games.js
```

**Sources:** Award-winning games from js13kGames annual competition

### 3. itch.io Games (`port-itch-games.js`)

Port free HTML5 games from itch.io indie game platform.

```bash
node scripts/port-itch-games.js
```

**Sources:** Nicky Case games, educational games, indie experiments

### 4. Phaser Examples (`port-phaser-examples.js`)

Port complete game examples from the Phaser game framework.

```bash
node scripts/port-phaser-examples.js
```

**Sources:** Official Phaser 3 example games (Breakout, Space Invaders, Snake, etc.)

### 5. PlayCanvas Games (`port-playcanvas-games.js`)

Port 3D WebGL games from PlayCanvas engine.

```bash
node scripts/port-playcanvas-games.js
```

**Sources:** Public PlayCanvas projects (Swooop, Master Archer, etc.)

### 6. 3kh0 Games (`port-3kh0-games.js`)

Port games from the 3kh0 unblocked games repository.

```bash
node scripts/port-3kh0-games.js
```

### 7. Poki Games (`port-poki-games.js`)

Port games from Poki platform by game slug.

```bash
node scripts/port-poki-games.js subway-surfers stickman-hook
```

---

## Legacy Tools

### Port Games (`port-game.js`)

Port games from tag2game.github.io with automatic thumbnail downloads.

```bash
node scripts/port-game.js
node scripts/port-game.js --no-thumbnails
node scripts/port-game.js --local path/to/game.html
```

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
