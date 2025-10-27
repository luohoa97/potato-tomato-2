<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-16 items-center px-4">
		<div class="mr-8 flex items-center space-x-2">
			<a href="/" class="flex items-center space-x-2">
				<span class="text-2xl">🥔🍅</span>
				<span class="font-bold text-xl">Potato Tomato Games</span>
			</a>
		</div>
		
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<nav class="flex items-center space-x-6">
				<a 
					href="/" 
					class="text-sm font-medium transition-colors hover:text-primary {$page.url.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'}"
				>
					Home
				</a>
				<Button href="/games" variant={$page.url.pathname === '/games' ? 'default' : 'ghost'}>
					Play Now
				</Button>
			</nav>
		</div>
	</div>
</nav>
