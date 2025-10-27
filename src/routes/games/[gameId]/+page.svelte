<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { loadGameMetadata, loadAllGames, type GameMetadata } from '$lib/utils/games';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Maximize, ArrowLeft, X } from 'lucide-svelte';
	import Fuse from 'fuse.js';

	let gameMetadata: GameMetadata | null = $state(null);
	let recommendedGames: GameMetadata[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let iframeElement: HTMLIFrameElement;
	let showFedoraBanner = $state(false);
	let bannerDismissed = $state(false);

	let gameId = $derived($page.params.gameId);

	function detectFedora(): boolean {
		if (typeof navigator === 'undefined') return false;
		const userAgent = navigator.userAgent.toLowerCase();
		return userAgent.includes('fedora');
	}

	function dismissBanner() {
		bannerDismissed = true;
		// Store dismissal in localStorage
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('fedoraBannerDismissed', 'true');
		}
	}

	onMount(async () => {
		// Check if user is on Fedora
		const isFedora = detectFedora();
		const dismissed = localStorage.getItem('fedoraBannerDismissed') === 'true';
		showFedoraBanner = !isFedora && !dismissed;

		gameMetadata = await loadGameMetadata(gameId);
		if (!gameMetadata) {
			error = 'Game not found';
		}
		
		const allGames = await loadAllGames();
		
		// Use fuzzy search to find similar games
		if (gameMetadata) {
			const fuse = new Fuse(allGames, {
				keys: [
					{ name: 'category', weight: 0.5 },
					{ name: 'name', weight: 0.3 },
					{ name: 'description', weight: 0.2 }
				],
				threshold: 0.4,
				includeScore: true
			});

			// Search using the current game's category and name
			const searchQuery = `${gameMetadata.category} ${gameMetadata.name}`;
			const results = fuse.search(searchQuery);
			
			// Filter out the current game and take top 4
			recommendedGames = results
				.map(r => r.item)
				.filter(g => g.id !== gameId)
				.slice(0, 4);
			
			// If we don't have enough recommendations, fill with same category games
			if (recommendedGames.length < 4) {
				const sameCategoryGames = allGames
					.filter(g => g.id !== gameId && g.category === gameMetadata.category)
					.filter(g => !recommendedGames.find(r => r.id === g.id))
					.slice(0, 4 - recommendedGames.length);
				recommendedGames = [...recommendedGames, ...sameCategoryGames];
			}
		}
		
		loading = false;
	});

	function toggleFullscreen() {
		if (!iframeElement) return;
		
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			iframeElement.requestFullscreen();
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if loading}
		<div class="text-center py-12">
			<p class="text-muted-foreground">Loading game...</p>
		</div>
	{:else if error || !gameMetadata}
		<div class="text-center py-12">
			<h2 class="text-2xl font-bold mb-4">Game Not Found</h2>
			<p class="text-muted-foreground mb-4">{error}</p>
			<a href="/games">
				<Button variant="outline">
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to Games
				</Button>
			</a>
		</div>
	{:else}
		<div class="mb-6">
			<a href="/games">
				<Button variant="ghost" class="mb-4">
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to Games
				</Button>
			</a>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold mb-2">{gameMetadata.name}</h1>
					<p class="text-muted-foreground">By {gameMetadata.author}</p>
				</div>
				<Button onclick={toggleFullscreen} variant="outline">
					<Maximize class="mr-2 h-4 w-4" />
					Fullscreen
				</Button>
			</div>
		</div>

		<div class="bg-card rounded-lg border shadow-lg overflow-hidden mb-8">
			{#if showFedoraBanner && !bannerDismissed}
				<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
						</svg>
						<div>
							<span class="font-semibold">Try Fedora Silverblue today!</span>
							<span class="ml-2">Speed up your gaming performance with Linux</span>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<a 
							href="https://fedoraproject.org/silverblue/" 
							target="_blank" 
							rel="noopener noreferrer"
							class="px-4 py-1.5 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
						>
							Learn More
						</a>
						<button 
							onclick={dismissBanner}
							class="p-1 hover:bg-white/20 rounded transition-colors"
							aria-label="Dismiss banner"
						>
							<X class="w-5 h-5" />
						</button>
					</div>
				</div>
			{/if}
			<iframe
				bind:this={iframeElement}
				src="{base}/games/html/{gameId}/index.html"
				title={gameMetadata.name}
				class="w-full aspect-video"
				allowfullscreen
			></iframe>
		</div>

		<div class="mb-8">
			<h2 class="text-xl font-semibold mb-2">About this game</h2>
			<p class="text-muted-foreground">{gameMetadata.description}</p>
		</div>

		{#if recommendedGames.length > 0}
			<section class="py-8">
				<h2 class="text-2xl font-bold mb-6">Recommended Games</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					{#each recommendedGames as game}
						<a href="/games/{game.id}" class="group block">
							<Card.Root class="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
								<div class="aspect-square overflow-hidden bg-muted">
									<img 
										src={game.thumbnail.startsWith('/') ? `${base}${game.thumbnail}` : game.thumbnail} 
										alt={game.name}
										class="h-full w-full object-cover transition-transform group-hover:scale-110"
										onerror={(e) => {
											e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256"%3E%3Crect fill="%23ddd" width="256" height="256"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
										}}
									/>
								</div>
								<Card.Header>
									<Card.Title class="text-base">{game.name}</Card.Title>
									<Card.Description class="text-sm">{game.description}</Card.Description>
								</Card.Header>
							</Card.Root>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>
