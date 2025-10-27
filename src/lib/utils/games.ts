export interface GameMetadata {
	id: string;
	name: string;
	author: string;
	description: string;
	thumbnail: string;
	category: string;
}

let cachedGameList: string[] | null = null;

async function fetchGameList(): Promise<string[]> {
	if (cachedGameList) {
		return cachedGameList;
	}

	try {
		const response = await fetch('/api/games');
		if (response.ok) {
			cachedGameList = await response.json();
			return cachedGameList;
		}
	} catch (error) {
		console.error('Failed to fetch game list:', error);
	}
	return [];
}

export async function loadAllGames(): Promise<GameMetadata[]> {
	const gameIds = await fetchGameList();
	const games: GameMetadata[] = [];

	for (const id of gameIds) {
		try {
			const response = await fetch(`/games/html/${id}/metadata.json`);
			if (response.ok) {
				const metadata = await response.json();
				games.push(metadata);
			}
		} catch (error) {
			console.error(`Failed to load metadata for ${id}:`, error);
		}
	}

	return games;
}

export async function loadGameMetadata(id: string): Promise<GameMetadata | null> {
	try {
		const response = await fetch(`/games/html/${id}/metadata.json`);
		if (response.ok) {
			return await response.json();
		}
	} catch (error) {
		console.error(`Failed to load metadata for ${id}:`, error);
	}
	return null;
}
