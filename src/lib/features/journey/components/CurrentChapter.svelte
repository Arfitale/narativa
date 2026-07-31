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
	class="sticky top-3 z-20 mb-6 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card/95 p-3.5 shadow-lg backdrop-blur-md transition-all sm:p-4"
>
	<!-- Chapter Info Section -->
	<div class="min-w-0 flex-1 space-y-0.5">
		<div
			class="text-royal_violet-600 dark:text-mauve_magic-500 flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase sm:text-xs"
		>
			<MapPin class="h-3.5 w-3.5 shrink-0" />
			<span>Chapter {currentChapter.id}</span>
			<span class="text-muted-foreground/60">•</span>
			<span class="font-semibold text-muted-foreground capitalize">{currentChapter.type}</span>
		</div>

		<h1 class="truncate text-sm font-extrabold text-card-foreground sm:text-base">
			{currentChapter.title}
		</h1>
	</div>

	<!-- Action Button -->
	<a
		href={`/chapter/${currentChapter.id}`}
		class="bg-royal_violet-600 hover:bg-royal_violet-700 flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-primary shadow-[0_3px_0_0_#310087] transition-all active:translate-y-0.5 active:shadow-none sm:px-4 sm:py-2.5 sm:text-sm sm:shadow-[0_4px_0_0_#310087] dark:text-white"
	>
		<Play class="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
		<span class="xs:inline hidden">Lanjut</span>
	</a>
</div>
