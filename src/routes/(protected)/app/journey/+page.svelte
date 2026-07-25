<script lang="ts">
	import CurrentChapter from '$lib/components/app/journey/CurrentChapter.svelte';
	import Node from '$lib/components/app/journey/Node.svelte';
	import StatsBar from '$lib/components/app/journey/StatsBar.svelte';

	type ChapterStatus = 'completed' | 'active' | 'locked';
	type ChapterType = 'material' | 'activity' | 'challenge';

	interface ChapterNode {
		id: number;
		title: string;
		type: ChapterType;
		status: ChapterStatus;
		offsetX: number;
	}

	const chapters: ChapterNode[] = [
		{ id: 1, title: 'Mengenal Anatomi Cerpen', type: 'material', status: 'completed', offsetX: 0 },
		{
			id: 2,
			title: 'Eksplorasi Alur & Konflik',
			type: 'activity',
			status: 'completed',
			offsetX: 45
		},
		{ id: 3, title: 'Latihan Karakterisasi', type: 'activity', status: 'completed', offsetX: 60 },
		{
			id: 4,
			title: 'Learning Challenge: Struktur Cerpen',
			type: 'challenge',
			status: 'active',
			offsetX: 20
		},
		{
			id: 5,
			title: 'Merancang Setting & Suasana',
			type: 'material',
			status: 'locked',
			offsetX: -30
		},
		{
			id: 6,
			title: 'Sudut Pandang (POV) Dalam Narasi',
			type: 'activity',
			status: 'locked',
			offsetX: -55
		},
		{
			id: 7,
			title: 'Learning Challenge: Puncak Konflik',
			type: 'challenge',
			status: 'locked',
			offsetX: -20
		},
		{
			id: 8,
			title: 'Story Studio: Draf Cerpen Pertama',
			type: 'challenge',
			status: 'locked',
			offsetX: 0
		}
	];
	const currentChapter = chapters.find((c) => c.status === 'active') || chapters[0];
</script>

<div
	class="flex min-h-screen bg-background font-sans text-foreground transition-colors duration-200"
>
	<!-- ==================== MAIN CONTENT (JOURNEY PATH) ==================== -->
	<main class="mx-auto flex max-w-2xl flex-1 flex-col items-center px-4 py-6">
		<CurrentChapter {currentChapter} />
		<div class="relative my-4 flex w-full flex-col items-center gap-10 pb-20">
			{#each chapters as chapter}
				<Node {chapter} />
			{/each}
		</div>
	</main>
	<StatsBar />
</div>
