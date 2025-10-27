export interface GameMetadata {
  id: string;
  name: string;
  author: string;
  description: string;
  thumbnail: string;
  category: string;
}

let cachedGames: GameMetadata[] | null = null;
let gameListCache: string[] | null = null;

async function fetchGameList(): Promise<string[]> {
  if (gameListCache) {
    return gameListCache;
  }

  try {
    const response = await fetch('/games/games-list.json');
    if (response.ok) {
      gameListCache = await response.json();
      return gameListCache;
    }
  } catch (error) {
    console.error('Failed to fetch game list:', error);
  }
  return [];
}

export async function loadAllGames(): Promise<GameMetadata[]> {
  if (cachedGames) {
    return cachedGames;
  }

  const gameIds = await fetchGameList();
  const games: GameMetadata[] = [];

  // Load all metadata files in parallel for speed
  const metadataPromises = gameIds.map(async (id) => {
    try {
      const response = await fetch(`/games/html/${id}/metadata.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Failed to load metadata for ${id}:`, error);
    }
    return null;
  });

  const results = await Promise.all(metadataPromises);
  cachedGames = results.filter((game) => game !== null) as GameMetadata[];

  return cachedGames;
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
