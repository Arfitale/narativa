<script lang="ts">
	import { page } from '$app/state';
	import { navItems } from '$lib/features/app/data/nav-item';
	import ModeToggle from '$lib/features/app/components/ModeToggle.svelte';
	import Logo from '$lib/features/app/components/Logo.svelte';
</script>

<aside
	class="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-border bg-card p-4 font-sans lg:flex"
>
	<div class="space-y-6">
		<!-- Logo App -->
		<Logo />

		<!-- Navigation Links -->
		<nav class="flex flex-col gap-2">
			{#each navItems as item (item.href)}
				{@const Icon = item.icon}
				{@const active = page.url.pathname.split('/app/')[1] === item.name}
				<a
					href={item.href}
					class={`flex items-center gap-4 rounded-2xl px-4 py-3 font-bold transition-all ${
						active
							? 'bg-royal_violet-600/10 text-royal_violet-700 dark:bg-indigo_ink-500/40 dark:text-mauve_magic-500 border-royal_violet-600/30 border'
							: 'text-muted-foreground hover:bg-accent hover:text-foreground'
					}`}
				>
					<Icon class="h-6 w-6" />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	</div>

	<!-- Footer Info Sederhana -->
	<div
		class="flex items-center justify-between border-t border-border px-2 pt-4 text-xs font-medium text-muted-foreground"
	>
		<p>Fase F • Bahasa Indonesia</p>
		<ModeToggle />
	</div>
</aside>
