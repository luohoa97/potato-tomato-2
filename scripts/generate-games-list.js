#!/usr/bin/env node

import { readdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateGamesList() {
	const gamesDir = join(__dirname, '..', 'static', 'games', 'html');

	if (!existsSync(gamesDir)) {
		console.error('Games directory not found');
		return;
	}

	const gameIds = readdirSync(gamesDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
		.filter((name) => {
			const metadataPath = join(gamesDir, name, 'metadata.json');
			return existsSync(metadataPath);
		});

	const outputPath = join(__dirname, '..', 'static', 'games', 'games-list.json');
	writeFileSync(outputPath, JSON.stringify(gameIds, null, 2));

	console.log(`✅ Generated games list with ${gameIds.length} games`);
	console.log(`   Saved to: static/games/games-list.json`);
}

generateGamesList();
