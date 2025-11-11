#!/usr/bin/env node

import { readdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
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

	// Generate games list
	const listOutputPath = join(__dirname, '..', 'static', 'games', 'games-list.json');
	writeFileSync(listOutputPath, JSON.stringify(gameIds, null, 2));

	console.log(`✅ Generated games list with ${gameIds.length} games`);
	console.log(`   Saved to: static/games/games-list.json`);

	// Generate consolidated metadata
	const allMetadata = [];
	for (const gameId of gameIds) {
		const metadataPath = join(gamesDir, gameId, 'metadata.json');
		try {
			const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
			allMetadata.push(metadata);
		} catch (error) {
			console.error(`❌ Failed to read metadata for ${gameId}:`, error.message);
		}
	}

	const metadataOutputPath = join(__dirname, '..', 'static', 'games', 'games-metadata.json');
	writeFileSync(metadataOutputPath, JSON.stringify(allMetadata, null, 2));

	console.log(`✅ Generated consolidated metadata with ${allMetadata.length} games`);
	console.log(`   Saved to: static/games/games-metadata.json`);
}

generateGamesList();
