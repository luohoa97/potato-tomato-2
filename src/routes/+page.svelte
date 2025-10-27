<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { loadAllGames, type GameMetadata } from '$lib/utils/games';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';

	let featuredGames: GameMetadata[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		featuredGames = await loadAllGames();
		loading = false;
	});
</script>

<div class="container mx-auto px-4 py-12">
	<section class="text-center py-20">
		<h1 class="text-5xl font-bold mb-4">
			Welcome to <span class="text-primary">Potato Tomato Games</span>
		</h1>
		<p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
			Your ultimate destination for unblocked games. Play anywhere, anytime!
		</p>
		<a href="/games">
			<Button size="lg" class="text-lg px-8 py-6">Play Now</Button>
		</a>
	</section>

	<section class="py-12">
		<h2 class="text-3xl font-bold mb-8">Featured Games</h2>
		
		{#if loading}
			<div class="text-center py-12">
				<p class="text-muted-foreground">Loading games...</p>
			</div>
		{:else if featuredGames.length === 0}
			<div class="text-center py-12">
				<p class="text-muted-foreground">No games available yet. Add games to /static/games/html/</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{#each featuredGames.slice(0, 4) as game}
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
								<Card.Title>{game.name}</Card.Title>
								<Card.Description>{game.description}</Card.Description>
							</Card.Header>
							<Card.Footer class="flex justify-between text-xs text-muted-foreground">
								<span>By {game.author}</span>
								<span class="px-2 py-1 rounded-full bg-primary/10 text-primary">{game.category}</span>
							</Card.Footer>
						</Card.Root>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>
