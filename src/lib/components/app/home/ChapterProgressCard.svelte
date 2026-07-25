<script lang="ts">
	import { BookOpen, Play } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import type { ChapterProgress } from './types';

	interface Props {
		chapter: ChapterProgress;
		onContinue?: () => void;
	}

	let { chapter, onContinue }: Props = $props();
</script>

<div
	class="relative w-full overflow-hidden rounded-2xl p-4 shadow-lg shadow-primary/10 transition-all sm:p-6"
	style:background={`linear-gradient(135deg, var(--gradient-from, var(--primary)), var(--gradient-to, var(--primary-foreground)))`}
>
	<!-- Decorative subtle glow -->
	<div
		class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl sm:h-40 sm:w-40"
		aria-hidden="true"
	></div>

	<div class="relative z-10 flex flex-col gap-3.5 sm:gap-4">
		<!-- Header Badge & Title -->
		<div class="space-y-1">
			<div
				class="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-white/80 uppercase sm:text-xs"
			>
				<BookOpen class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
				<span>{chapter.chapterLabel}</span>
			</div>

			<h2
				class="line-clamp-1 font-display text-base font-bold tracking-tight text-white sm:text-xl"
			>
				{chapter.title}
			</h2>
		</div>

		<!-- Compact Progress & Action Row -->
		<div class="flex items-center justify-between gap-4 pt-0.5">
			<!-- Progress Section -->
			<div class="flex-1 space-y-1">
				<div
					class="flex items-center justify-between text-[11px] font-semibold text-white/90 sm:text-xs"
				>
					<span>Progress</span>
					<span class="tabular-nums">{chapter.percent}%</span>
				</div>

				<div
					class="h-1.5 w-full overflow-hidden rounded-full bg-black/25 backdrop-blur-xs sm:h-2"
					role="progressbar"
					aria-valuenow={chapter.percent}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={`Progress for ${chapter.title}`}
				>
					<div
						class="h-full rounded-full bg-white transition-all duration-500 ease-out"
						style:width="{Math.min(100, Math.max(0, chapter.percent))}%"
					></div>
				</div>
			</div>

			<!-- Action Button -->
			<Button
				onclick={onContinue}
				size="sm"
				class="h-9 shrink-0 gap-1.5 rounded-xl bg-white px-3.5 text-xs font-semibold text-zinc-900 shadow-md hover:bg-white/90 active:scale-95 sm:h-10 sm:px-4 sm:text-sm"
			>
				<Play class="h-3.5 w-3.5 fill-current text-zinc-900" />
				<span>Continue</span>
			</Button>
		</div>
	</div>
</div>
