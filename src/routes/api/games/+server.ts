import { json } from '@sveltejs/kit';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

export function GET() {
	try {
		const gamesDir = join(process.cwd(), 'static', 'games', 'html');

		if (!existsSync(gamesDir)) {
			return json([]);
		}

		const gameIds = readdirSync(gamesDir, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name)
			.filter((name) => {
				// Only include directories that have a metadata.json file
				const metadataPath = join(gamesDir, name, 'metadata.json');
				return existsSync(metadataPath);
			});

		return json(gameIds);
	} catch (error) {
		console.error('Error reading games directory:', error);
		return json([]);
	}
}
