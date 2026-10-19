<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen bg-background">
	<main class="flex-1 pb-20 lg:pb-0">
		{@render children?.()}
	</main>
</div>
