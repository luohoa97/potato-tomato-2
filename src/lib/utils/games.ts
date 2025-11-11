import { base } from '$app/paths';

export interface GameMetadata {
  id: string;
  name: string;
  author: string;
  description: string;
  thumbnail: string;
  category: string;
}

let cachedGames: GameMetadata[] | null = null;

export async function loadAllGames(): Promise<GameMetadata[]> {
  if (cachedGames) {
    return cachedGames;
  }

  try {
    const response = await fetch(`${base}/games/games-metadata.json`);
    if (response.ok) {
      cachedGames = await response.json();
      return cachedGames;
    }
  } catch (error) {
    console.error('Failed to load games metadata:', error);
  }
  
  return [];
}

export async function loadGameMetadata(id: string): Promise<GameMetadata | null> {
  try {
    const response = await fetch(`${base}/games/html/${id}/metadata.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Failed to load metadata for ${id}:`, error);
  }
  return null;
}
