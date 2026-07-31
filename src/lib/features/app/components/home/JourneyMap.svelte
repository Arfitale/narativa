<script lang="ts">
	import { Map, Check, Flag } from '@lucide/svelte';

	type NodeStatus = 'done' | 'current' | 'upcoming';

	interface Node {
		label: string;
		status: NodeStatus;
	}

	let {
		nodes = [],
		onSelect
	}: {
		nodes: Node[];
		onSelect?: (index: number) => void;
	} = $props();
</script>

<div class="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
	<!-- Header Section -->
	<div class="flex items-center gap-2 text-sm font-medium text-foreground">
		<Map class="h-4 w-4 text-primary" />
		<span>Perjalanan</span>
	</div>

	<!-- Journey Tracker / Progress Steps -->
	<div class="mt-6 flex items-start justify-between">
		{#each nodes as node, i (node.label)}
			<div class="group relative flex flex-1 flex-col items-center text-center last:flex-none">
				<!-- Connector Line (Positioned behind the indicators) -->
				{#if i < nodes.length - 1}
					<div
						class="absolute top-3 right-[calc(-50%+12px)] left-[calc(50%+12px)] z-0 h-0.5"
						aria-hidden="true"
					>
						<div
							class={`h-full transition-all duration-300 ${
								node.status === 'done' ? 'bg-primary' : 'bg-border'
							}`}
						></div>
					</div>
				{/if}

				<!-- Interactive Step Button -->
				<button
					type="button"
					onclick={() => onSelect?.(i)}
					class="relative z-10 flex flex-col items-center gap-2.5 rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					<!-- Indicator Circle -->
					<div
						class={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs transition-all duration-200 group-hover:scale-110 ${
							node.status === 'done'
								? 'border-primary bg-primary text-primary-foreground'
								: node.status === 'current'
									? 'border-primary bg-background text-primary ring-4 ring-primary/20'
									: 'border-border bg-muted text-muted-foreground'
						}`}
					>
						{#if i === nodes.length - 1 && node.status !== 'done'}
							<Flag class="h-3 w-3" />
						{:else if node.status === 'done'}
							<Check class="h-3.5 w-3.5 stroke-3" />
						{:else if node.status === 'current'}
							<span class="h-2 w-2 rounded-full bg-primary"></span>
						{/if}
					</div>

					<!-- Step Label -->
					<span
						class={`max-w-20 text-[11px] leading-tight font-medium transition-colors sm:max-w-25 sm:text-xs ${
							node.status === 'upcoming'
								? 'text-muted-foreground group-hover:text-foreground'
								: 'font-semibold text-foreground'
						}`}
					>
						{node.label}
					</span>
				</button>
			</div>
		{/each}
	</div>
</div>
