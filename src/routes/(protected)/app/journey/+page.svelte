<script lang="ts">
	import CurrentChapter from '$lib/features/journey/components/CurrentChapter.svelte';
	import Node from '$lib/features/journey/components/Node.svelte';
	import StatsBar from '$lib/features/journey/components/StatsBar.svelte';
	import type { Unit } from '$lib/features/journey/types';

	const units: Unit[] = [
		{
			id: 1,
			title: 'Bab 1: Dasar Narrative Writing',
			description: 'Memahami pondasi utama dalam membangun cerita pendek yang memikat.',
			bannerColor: 'from-violet-600 to-indigo-600',
			chapters: [
				{
					id: 1,
					title: 'Mengenal Anatomi Cerpen',
					type: 'material',
					status: 'completed',
					offsetX: 0
				},
				{
					id: 2,
					title: 'Eksplorasi Alur & Konflik',
					type: 'activity',
					status: 'completed',
					offsetX: 45
				},
				{
					id: 3,
					title: 'Latihan Karakterisasi',
					type: 'activity',
					status: 'completed',
					offsetX: 60
				},
				{
					id: 4,
					title: 'Learning Challenge: Struktur Cerpen',
					type: 'challenge',
					status: 'active',
					offsetX: 20
				}
			]
		},
		{
			id: 2,
			title: 'Bab 2: Atmosfer & Sudut Pandang',
			description: 'Menciptakan dunia cerita yang hidup dan memilih perspektif narasi.',
			bannerColor: 'from-emerald-600 to-teal-600',
			chapters: [
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
			]
		}
	];

	// Flatten all chapters to easily find active node
	const allChapters = $derived(units.flatMap((u) => u.chapters));
	const currentChapter = $derived(allChapters.find((c) => c.status === 'active') || allChapters[0]);
	const activeIndex = $derived(allChapters.findIndex((c) => c.status === 'active'));

	let nodePoints = $state<{ x: number; y: number }[]>([]);
	let containerEl = $state<HTMLDivElement | null>(null);
	let activePopoverId = $state<number | null>(null);
	let activeNodeEl = $state<HTMLElement | null>(null);
	let hasAutoScrolled = $state(false); // Prevents re-scrolling on window resize

	function scrollToActiveNode() {
		if (hasAutoScrolled) return;

		// Find active node button element inside container
		const activeBtn = containerEl?.querySelector<HTMLElement>('[data-active-node="true"]');

		if (activeBtn) {
			activeBtn.scrollIntoView({
				behavior: 'smooth',
				block: 'center' // Centers the active node in the viewport
			});
			hasAutoScrolled = true;
		}
	}

	function updateNodePositions() {
		if (!containerEl) return;

		const containerRect = containerEl.getBoundingClientRect();
		const buttonEls = containerEl.querySelectorAll<HTMLElement>('[data-node-button]');

		if (buttonEls.length === 0) return;

		const points: { x: number; y: number }[] = [];

		buttonEls.forEach((btn) => {
			const rect = btn.getBoundingClientRect();
			const x = rect.left + rect.width / 2 - containerRect.left;
			const y = rect.top + rect.height / 2 - containerRect.top;
			points.push({ x, y });
		});

		nodePoints = points;
	}

	function buildPath(points: { x: number; y: number }[]) {
		if (points.length < 2) return '';

		return points.reduce((acc, point, i) => {
			if (i === 0) return `M ${point.x} ${point.y}`;

			const prev = points[i - 1];
			const deltaY = point.y - prev.y;

			const controlY1 = prev.y + deltaY / 2;
			const controlY2 = point.y - deltaY / 2;

			return `${acc} C ${prev.x} ${controlY1}, ${point.x} ${controlY2}, ${point.x} ${point.y}`;
		}, '');
	}

	let fullPathD = $derived(buildPath(nodePoints));
	let completedPathD = $derived(
		buildPath(nodePoints.slice(0, (activeIndex >= 0 ? activeIndex : allChapters.length) + 1))
	);

	$effect(() => {
		if (containerEl) {
			requestAnimationFrame(() => {
				updateNodePositions();
				scrollToActiveNode(); // Automatically scrolls to active node on mount
			});

			const observer = new ResizeObserver(() => updateNodePositions());
			observer.observe(containerEl);

			return () => observer.disconnect();
		}
	});
</script>

<div
	class="flex min-h-screen bg-background font-sans text-foreground transition-colors duration-200"
>
	<!-- ==================== MAIN CONTENT ==================== -->
	<main class="mx-auto flex max-w-2xl flex-1 flex-col items-center px-4 py-6">
		<CurrentChapter {currentChapter} />

		<div
			bind:this={containerEl}
			class="relative my-6 flex w-full flex-col items-center gap-12 pb-20"
		>
			<!-- SVG Path Layer -->
			<svg
				class="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
				aria-hidden="true"
			>
				{#if fullPathD}
					<path
						d={fullPathD}
						fill="none"
						class="stroke-zinc-300 dark:stroke-zinc-700/80"
						stroke-width="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				{/if}

				{#if completedPathD}
					<path
						d={completedPathD}
						fill="none"
						class="stroke-violet-500/30 blur-md transition-all duration-500 dark:stroke-violet-400/40"
						stroke-width="18"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d={completedPathD}
						fill="none"
						class="stroke-violet-600 transition-all duration-500 dark:stroke-violet-400"
						stroke-width="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				{/if}
			</svg>

			<!-- Render Units with Sections -->
			{#each units as unit, unitIdx}
				<div class="relative z-10 flex w-full flex-col items-center gap-10">
					<!-- Duolingo-style Unit Section Header -->
					<div
						class={`w-full rounded-2xl bg-linear-to-r ${unit.bannerColor} p-5 text-white shadow-lg`}
					>
						<span class="text-xs font-bold tracking-wider text-white/80 uppercase">
							UNIT {unit.id}
						</span>
						<h2 class="text-lg font-extrabold sm:text-xl">{unit.title}</h2>
						<p class="mt-1 text-xs text-white/90 sm:text-sm">{unit.description}</p>
					</div>

					<!-- Chapter Nodes inside Unit -->
					<div class="flex w-full flex-col items-center gap-12">
						{#each unit.chapters as chapter}
							<Node {chapter} bind:activePopoverId />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</main>
</div>
