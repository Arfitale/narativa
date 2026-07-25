<script lang="ts">
	import { MapPin, Play } from '@lucide/svelte';

	interface Props {
		currentChapter: {
			id: number;
			title: string;
			type: 'material' | 'activity' | 'challenge';
			status: 'completed' | 'active' | 'locked';
			offsetX: number;
		};
	}

	const { currentChapter }: Props = $props();
</script>

<div
	class="sticky top-4 z-20 mb-8 flex w-full items-center justify-between rounded-2xl border-2 border-border bg-card p-4 shadow-lg backdrop-blur-md"
>
	<div class="space-y-1">
		<div
			class="text-royal_violet-600 dark:text-mauve_magic-500 flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
		>
			<MapPin class="h-4 w-4" />
			Chapter {currentChapter.id}
		</div>
		<h1 class="text-lg font-extrabold">{currentChapter.title}</h1>
	</div>
	<a
		href={`/chapter/${currentChapter.id}`}
		class="bg-royal_violet-600 hover:bg-royal_violet-700 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-[0_4px_0_0_#310087] transition-all active:translate-y-1 active:shadow-none dark:text-white"
	>
		<Play class="h-4 w-4 dark:fill-white" />
		Lanjut
	</a>
</div>
