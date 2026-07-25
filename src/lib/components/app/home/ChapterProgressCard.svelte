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
	class="relative overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-xl shadow-primary/10 transition-all sm:p-7"
	style:background={`linear-gradient(135deg, var(--gradient-from, var(--primary)), var(--gradient-to, var(--primary-foreground)))`}
>
	<!-- Decorative background accent glow -->
	<div
		class="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
		aria-hidden="true"
	></div>

	<div class="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
		<!-- Content Section -->
		<div class="flex-1 space-y-3">
			<!-- Header Badge / Category -->
			<div
				class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-white/80 uppercase"
			>
				<BookOpen class="h-3.5 w-3.5" />
				<span>{chapter.chapterLabel}</span>
			</div>

			<!-- Title -->
			<h2 class="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
				{chapter.title}
			</h2>

			<!-- Accessible Progress Bar -->
			<div class="pt-1">
				<div class="flex items-center justify-between text-xs font-semibold text-white/90">
					<span>Progress</span>
					<span class="tabular-nums">{chapter.percent}%</span>
				</div>
				<div
					class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-black/20 backdrop-blur-xs"
					role="progressbar"
					aria-valuenow={chapter.percent}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={`Progress for ${chapter.title}`}
				>
					<div
						class="h-full rounded-full bg-white shadow-xs transition-all duration-500 ease-out"
						style:width="{Math.min(100, Math.max(0, chapter.percent))}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Action Button -->
		<div class="shrink-0">
			<Button
				onclick={onContinue}
				size="lg"
				class="w-full gap-2 rounded-xl bg-white font-semibold text-zinc-900 shadow-md hover:bg-white/90 hover:shadow-lg active:scale-[0.98] sm:w-auto"
			>
				<Play class="h-4 w-4 fill-current text-zinc-900" />
				<span>Continue Journey</span>
			</Button>
		</div>
	</div>
</div>
