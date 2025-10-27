<script lang="ts">
	import { onMount } from 'svelte';
	import { loadAllGames, type GameMetadata } from '$lib/utils/games';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import Fuse from 'fuse.js';

	let games: GameMetadata[] = $state([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let fuse: Fuse<GameMetadata> | null = null;

	onMount(async () => {
		games = await loadAllGames();
		
		// Initialize Fuse.js for fuzzy search
		fuse = new Fuse(games, {
			keys: ['name', 'description', 'author', 'category'],
			threshold: 0.3, // Lower = more strict, higher = more fuzzy
			includeScore: true,
			minMatchCharLength: 2
		});
		
		loading = false;
	});

	let filteredGames = $derived.by(() => {
		let results = games;

		// Apply fuzzy search if query exists
		if (searchQuery.trim() && fuse) {
			const searchResults = fuse.search(searchQuery);
			results = searchResults.map(result => result.item);
		}

		// Apply category filter
		if (selectedCategory !== 'all') {
			results = results.filter(game => game.category === selectedCategory);
		}

		return results;
	});

	let categories = $derived(['all', ...new Set(games.map(g => g.category))]);
</script>

<div class="container mx-auto px-4 py-12">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-4">All Games</h1>
		<p class="text-muted-foreground">Browse our collection of unblocked games</p>
	</div>

	<div class="mb-8 flex flex-col sm:flex-row gap-4">
		<Input
			type="text"
			placeholder="Search games..."
			bind:value={searchQuery}
			class="w-full sm:w-64"
		/>
		
		<Select.Root
			onSelectedChange={(v) => {
				selectedCategory = v?.value || 'all';
			}}
		>
			<Select.Trigger class="w-full sm:w-48">
				<Select.Value placeholder="All Categories" />
			</Select.Trigger>
			<Select.Content>
				{#each categories as category}
					<Select.Item value={category}>
						{category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	{#if loading}
		<div class="text-center py-12">
			<p class="text-muted-foreground">Loading games...</p>
		</div>
	{:else if filteredGames.length === 0}
		<div class="text-center py-12">
			<p class="text-muted-foreground">
				{searchQuery || selectedCategory !== 'all' ? 'No games match your filters' : 'No games available yet'}
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{#each filteredGames as game}
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
</div>
