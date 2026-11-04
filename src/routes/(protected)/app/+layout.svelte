<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen bg-background">
	<form action="/auth/signout" method="POST">
		<Button type="submit">Logout</Button>
	</form>
	<main class="flex-1 pb-20 lg:pb-0">
		{@render children?.()}
	</main>
</div>
