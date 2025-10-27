<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { Menu } from 'lucide-svelte';

	let isOpen = $state(false);

	const categories = [
		{ title: 'Action Games', href: '/games?category=action', description: 'Fast-paced action and combat games' },
		{ title: 'Sports Games', href: '/games?category=sports', description: 'Soccer, basketball, and more' },
		{ title: 'Racing Games', href: '/games?category=racing', description: 'Cars, bikes, and high-speed thrills' },
		{ title: 'Puzzle Games', href: '/games?category=puzzle', description: 'Brain teasers and logic challenges' },
		{ title: 'Platformer Games', href: '/games?category=platformer', description: 'Jump, run, and explore' },
		{ title: 'Shooter Games', href: '/games?category=shooter', description: 'FPS and shooting action' },
	];
</script>

<nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-16 items-center px-4">
		<!-- Logo -->
		<a href="/" class="flex items-center space-x-2 flex-shrink-0">
			<span class="text-2xl">🥔🍅</span>
			<span class="font-bold text-xl">Potato Tomato Games</span>
		</a>

		<!-- Desktop Navigation - Centered -->
		<div class="hidden lg:flex flex-1 justify-center">
			<NavigationMenu.Root>
				<NavigationMenu.List class="flex space-x-6">
					<NavigationMenu.Item>
						<NavigationMenu.Trigger class="font-medium hover:text-primary">
							Categories
						</NavigationMenu.Trigger>
						<NavigationMenu.Content>
							<ul class="grid w-[400px] gap-3 p-4 md:grid-cols-2">
								{#each categories as category}
									<li>
										<NavigationMenu.Link href={category.href} class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
											<div class="text-sm font-medium leading-none">{category.title}</div>
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												{category.description}
											</p>
										</NavigationMenu.Link>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<NavigationMenu.Item>
						<NavigationMenu.Link 
							href="/games" 
							class="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 {$page.url.pathname === '/games' ? 'text-primary' : ''}"
						>
							All Games
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
		</div>

		<!-- Desktop Actions -->
		<div class="hidden lg:flex items-center space-x-3 flex-shrink-0">
			<Button href="/games" variant={$page.url.pathname.startsWith('/games') ? 'default' : 'outline'}>
				Play Now
			</Button>
		</div>

		<!-- Mobile Menu Button -->
		<div class="lg:hidden ml-auto">
			<Sheet.Root bind:open={isOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon">
						<Menu class="h-5 w-5" />
						<span class="sr-only">Toggle menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-[300px] sm:w-[400px]">
					<div class="flex flex-col space-y-6 mt-8">
						<!-- Mobile Logo -->
						<div class="flex items-center space-x-2 pb-4 border-b">
							<span class="text-2xl">🥔🍅</span>
							<span class="font-bold text-xl">Potato Tomato Games</span>
						</div>

						<!-- Mobile Navigation -->
						<div class="space-y-4">
							<div>
								<h3 class="text-sm font-semibold text-muted-foreground mb-2">Categories</h3>
								<div class="space-y-2">
									{#each categories as category}
										<a
											href={category.href}
											class="block text-sm text-foreground hover:text-primary transition-colors"
											onclick={() => (isOpen = false)}
										>
											{category.title}
										</a>
									{/each}
								</div>
							</div>

							<div class="space-y-2">
								<a
									href="/games"
									class="block text-sm transition-colors {$page.url.pathname === '/games' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}"
									onclick={() => (isOpen = false)}
								>
									All Games
								</a>
							</div>
						</div>

						<!-- Mobile Actions -->
						<div class="pt-4 border-t">
							<Button href="/games" class="w-full" onclick={() => (isOpen = false)}>
								Play Now
							</Button>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</nav>
