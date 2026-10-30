<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let learningTracks = $derived(data.learningTracks);
	let sections = $derived(learningTracks?.sections);
</script>

{#if learningTracks}
	<div class="learning-tracks">
		<h1 class="title">{learningTracks.title}</h1>
		<h2>{learningTracks.description}</h2>
	</div>
	<div class="sections">
		{#each sections as section}
			<div class="section">
				<h1 class="title">{section.title}</h1>
				<h2>{section.description}</h2>
				{#each section.nodes as node}
					<a href={`/app/journey/${node.slug}`}>{node.title}</a>
				{/each}
			</div>
		{/each}
	</div>
{/if}
