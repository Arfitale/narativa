<script lang="ts">
	import Greeting from '$lib/components/app/home/Greeting.svelte';
	import ChapterProgressCard from '$lib/components/app/home/ChapterProgressCard.svelte';
	import JourneyMap from '$lib/components/app/home/JourneyMap.svelte';
	import BadgesCard from '$lib/components/app/home/BadgesCard.svelte';
	import StoryCollectionCard from '$lib/components/app/home/StoryCollectionCard.svelte';
	import type { ChapterProgress, JourneyNode, BadgeItem } from '$lib/components/app/home/types';

	const chapter: ChapterProgress = {
		chapterLabel: 'Chapter 2',
		title: 'Memahami Cerita',
		percent: 26
	};

	const journeyNodes: JourneyNode[] = [
		{ label: 'Bab 1', status: 'done' },
		{ label: 'Bab 2', status: 'current' },
		{ label: 'Bab 3', status: 'upcoming' },
		{ label: 'Bab 4', status: 'upcoming' },
		{ label: 'Bab 5', status: 'upcoming' },
		{ label: 'Selesai', status: 'upcoming' }
	];

	const badges: BadgeItem[] = [];

	function handleContinue() {
		console.log('continue journey');
	}

	function handleJourneySelect(index: number) {
		console.log('open node', index);
	}
</script>

<svelte:head>
	<title>Beranda · Deskriptia</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-5 p-4 sm:p-6 lg:p-8">
	<Greeting name="Jaya" />

	<ChapterProgressCard {chapter} onContinue={handleContinue} />

	<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
		<JourneyMap nodes={journeyNodes} onSelect={handleJourneySelect} />
		<BadgesCard {badges} />
	</div>

	<StoryCollectionCard storiesLearned={12} />
</div>
