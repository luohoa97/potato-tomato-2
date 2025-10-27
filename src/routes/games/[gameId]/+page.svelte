<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { loadGameMetadata, loadAllGames, type GameMetadata } from '$lib/utils/games';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Maximize, ArrowLeft } from 'lucide-svelte';

	let gameMetadata: GameMetadata | null = $state(null);
	let recommendedGames: GameMetadata[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let iframeElement: HTMLIFrameElement;

	let gameId = $derived($page.params.gameId);

	onMount(async () => {
		gameMetadata = await loadGameMetadata(gameId);
		if (!gameMetadata) {
			error = 'Game not found';
		}
		
		const allGames = await loadAllGames();
		recommendedGames = allGames.filter(g => g.id !== gameId).slice(0, 4);
		
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
			<iframe
				bind:this={iframeElement}
				src="/games/html/{gameId}/index.html"
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
										src={game.thumbnail} 
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
