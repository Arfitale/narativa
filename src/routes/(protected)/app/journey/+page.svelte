<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let learningTracks = $derived(data.learningTracks);
	let progressionTrack = $derived(data.progression);
</script>

{#if progressionTrack && learningTracks}
	<div class="learning-tracks">
		<h1 class="title">{learningTracks.title}</h1>
	</div>
	<div class="sections">
		{#each progressionTrack.sections as section}
			{#if section.state === 'locked'}
				<h2>Section is locked</h2>
			{:else if section.state === 'unlocked'}
				<h2 class="title">{section.title}</h2>
				{#each progressionTrack.nodes as node}
					{#if node.sectionId === section.id}
						{#if node.state === 'locked'}
							Node Locked
						{:else}
							<h2>{node.title}</h2>
						{/if}
					{/if}
				{/each}
			{/if}
		{/each}
	</div>
{/if}
