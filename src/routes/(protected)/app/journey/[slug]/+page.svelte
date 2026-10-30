<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let node = $derived(data.node);
	$inspect(node);
</script>
