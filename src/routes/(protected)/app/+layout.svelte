<script lang="ts">
	import SideNav from '$lib/components/app/nav/SideNav.svelte';
	import BottomNav from '$lib/components/app/nav/BottomNav.svelte';
	import DialogueSystem from '$lib/features/dialogues/components/DialogueSystem.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen bg-background">
	<SideNav />

	<main class="flex-1 pb-20 lg:pb-0">
		{@render children?.()}
	</main>

	<DialogueSystem />
	<BottomNav />
</div>
