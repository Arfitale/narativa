<script lang="ts">
	import { navItems } from '$lib/data/nav-item';
	import { page } from '$app/state';
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-border bg-card/95 px-2 py-2 backdrop-blur-sm lg:hidden"
>
	{#each navItems as item (item.href)}
		{@const Icon = item.icon}
		{@const active = page.url.pathname === item.href}
		<a
			href={item.href}
			class={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
				active ? 'text-primary dark:text-white' : 'text-muted-foreground'
			}`}
		>
			<Icon class="h-5 w-5" />
		</a>
	{/each}
</nav>
