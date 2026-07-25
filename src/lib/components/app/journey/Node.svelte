<script lang="ts">
	import { BookOpen, Check, Sparkles, Lock, Play } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Popover as BitsPopover } from 'bits-ui'; // Import Bits UI Popover directly
	import NodeTooltip from './NodeTooltip.svelte';

	interface Props {
		chapter: {
			id: number;
			title: string;
			type: 'material' | 'activity' | 'challenge';
			status: 'completed' | 'active' | 'locked';
			offsetX: number;
		};
		activePopoverId: number | null;
	}

	let { chapter, activePopoverId = $bindable(null) }: Props = $props();

	$effect(() => {});

	const variants = {
		completed: {
			base: 'bg-violet-800',
			top: 'bg-violet-600 border-violet-400 hover:brightness-110 hover:translate-y-0.5 active:translate-y-[6px]'
		},
		active: {
			base: 'bg-violet-900',
			top: 'bg-violet-500 border-white hover:translate-y-0.5 active:translate-y-[6px]'
		},
		locked: {
			base: 'bg-zinc-300 dark:bg-zinc-800',
			top: 'bg-muted border-border text-muted-foreground cursor-not-allowed'
		}
	};

	let style = $derived(variants[chapter.status]);
	let isOpen = $derived(activePopoverId === chapter.id);
	let isTooltipVisible = $derived(chapter.status === 'active' && !isOpen);

	function handleOpenChange(open: boolean) {
		if (open) {
			activePopoverId = chapter.id; // Open this node (closes all others)
		} else if (activePopoverId === chapter.id) {
			activePopoverId = null; // Close if this node was open
		}
	}

	$inspect(isTooltipVisible, 'isTooltipVisible');
</script>

<div
	class="relative flex flex-col items-center select-none"
	style="transform: translateX({chapter.offsetX}px)"
>
	{#if isTooltipVisible}
		<NodeTooltip />
	{/if}
	<Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
		<Popover.Trigger
			data-node-button
			data-active-node={chapter.status === 'active'}
			disabled={chapter.status === 'locked'}
			class="group relative h-20 w-20 cursor-pointer focus:outline-none disabled:cursor-not-allowed"
		>
			<div class={`absolute inset-0 translate-y-1.5 rounded-full ${style.base}`}></div>
			<div
				class={`
                    relative z-10 flex h-20 w-20 items-center justify-center
                    rounded-full border-4 transition-all duration-75
                    ${style.top}
                `}
			>
				{#if chapter.status === 'completed'}
					<Check class="h-9 w-9 stroke-3 text-white" />
				{:else if chapter.status === 'active'}
					{#if chapter.type === 'challenge'}
						<Sparkles class="h-9 w-9 animate-pulse text-white" />
					{:else}
						<BookOpen class="h-9 w-9 text-white" />
					{/if}
				{:else}
					<Lock class="h-8 w-8" />
				{/if}
			</div>

			{#if chapter.status === 'active'}
				<div
					class="absolute -inset-2 -z-10 animate-pulse rounded-full bg-violet-500/20 blur-xl"
				></div>
			{/if}
		</Popover.Trigger>

		<Popover.Content
			side="top"
			sideOffset={12}
			align="center"
			class="z-50 w-56 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl"
		>
			<div class="mb-1 flex items-center justify-between">
				<span class="text-[10px] font-bold tracking-wider text-violet-500 uppercase">
					{chapter.type}
				</span>
			</div>
			<p class="mb-3 text-xs leading-tight font-bold">
				{chapter.title}
			</p>

			<button
				onclick={() => (isOpen = false)}
				class="flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-violet-700 active:scale-95"
			>
				<Play class="h-3.5 w-3.5 fill-current" />
				Start Chapter
			</button>
			<BitsPopover.Arrow style="fill: #3182ce;" />
		</Popover.Content>
	</Popover.Root>

	<!-- <span
		class={`absolute mt-3 max-w-32 text-center text-xs font-bold ${
			chapter.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
		}`}
	>
		{chapter.title}
	</span> -->
</div>
