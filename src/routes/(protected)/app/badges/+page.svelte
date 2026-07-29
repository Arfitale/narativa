<script lang="ts">
	import {
		Trophy,
		Sparkles,
		Flame,
		BookOpen,
		PenTool,
		Award,
		Lock,
		CircleCheck,
		Search,
		Medal
	} from '@lucide/svelte';
	import type { Badge, UserAchievementSummary } from '$lib/types/badges';

	// Summary data matching Narativa branding
	const summary: UserAchievementSummary = {
		totalPoints: 1240,
		currentTier: 'Penulis Berbakat',
		nextTier: 'Maestro Narasi',
		pointsToNextTier: 260,
		tierProgressPercent: 82,
		unlockedCount: 14,
		totalBadgesCount: 24
	};

	const badges: Badge[] = [
		{
			id: '1',
			title: 'Draf Pertama',
			description: 'Menyelesaikan bab pertama dalam draf cerpen Anda.',
			category: 'writing',
			points: 50,
			unlocked: true,
			unlockedAt: '12 Jul 2026',
			icon: 'pen'
		},
		{
			id: '2',
			title: 'Pena Produktif',
			description: 'Menulis lebih dari 1.000 kata dalam satu hari.',
			category: 'writing',
			points: 100,
			unlocked: true,
			unlockedAt: '18 Jul 2026',
			icon: 'sparkles'
		},
		{
			id: '3',
			title: 'Kritikus Handal',
			description: 'Memberikan 5 ulasan konstruktif pada karya penulis lain.',
			category: 'community',
			points: 75,
			unlocked: true,
			unlockedAt: '22 Jul 2026',
			icon: 'award'
		},
		{
			id: '4',
			title: 'Pembaca Setia',
			description: 'Menyelesaikan membaca 10 cerita pendek di platform.',
			category: 'reading',
			points: 60,
			unlocked: false,
			progress: { current: 7, max: 10 },
			icon: 'book'
		},
		{
			id: '5',
			title: 'Api Semangat',
			description: 'Pertahankan streak menulis selama 7 hari berturut-turut.',
			category: 'streak',
			points: 150,
			unlocked: false,
			progress: { current: 5, max: 7 },
			icon: 'flame'
		},
		{
			id: '6',
			title: 'Master Cerpen',
			description: 'Selesaikan seluruh modul pada Bab 1 & 2 Journey.',
			category: 'writing',
			points: 200,
			unlocked: false,
			progress: { current: 4, max: 8 },
			icon: 'trophy'
		}
	];

	let activeTab = $state<'all' | 'unlocked' | 'writing' | 'reading'>('all');
	let searchQuery = $state('');

	// Filtered badge list
	let filteredBadges = $derived(
		badges.filter((b) => {
			const matchesTab =
				activeTab === 'all'
					? true
					: activeTab === 'unlocked'
						? b.unlocked
						: b.category === activeTab;

			const matchesSearch =
				b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				b.description.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesTab && matchesSearch;
		})
	);
</script>

<div class="min-h-screen bg-background pb-20 text-foreground">
	<!-- Main Container -->
	<main class="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
		<!-- ================= HERO SUMMARY CARD ================= -->
		<div
			class="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 via-violet-700 to-indigo-900 p-6 text-white shadow-xl sm:p-8"
		>
			<!-- Ambient Decorative Background Circles -->
			<div
				class="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
			></div>
			<div
				class="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl"
			></div>

			<div class="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<!-- Total Points Header -->
				<div class="space-y-1">
					<div
						class="flex items-center gap-2 text-xs font-bold tracking-widest text-violet-200 uppercase"
					>
						<Trophy class="h-4 w-4 text-amber-300" />
						<span>Poin Prestasi</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="font-display text-4xl font-black tracking-tight sm:text-5xl">
							{summary.totalPoints.toLocaleString()}
						</span>
						<span class="text-sm font-semibold text-violet-200">PTS</span>
					</div>
					<p class="text-xs text-violet-200/90 sm:text-sm">
						{summary.unlockedCount} dari {summary.totalBadgesCount} Lencana Terbuka
					</p>
				</div>

				<!-- Rank Tier Progression -->
				<div
					class="w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md sm:p-5"
				>
					<div class="mb-2 flex items-center justify-between text-xs font-bold text-violet-100">
						<span class="flex items-center gap-1.5">
							<Medal class="h-4 w-4 text-amber-300" />
							{summary.currentTier}
						</span>
						<span class="text-violet-300">{summary.pointsToNextTier} PTS lagi</span>
					</div>

					<!-- Tier Progress Bar -->
					<div class="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
						<div
							class="h-full rounded-full bg-linear-to-r from-amber-300 to-amber-400 transition-all duration-500"
							style:width="{summary.tierProgressPercent}%"
						></div>
					</div>

					<div class="mt-2 flex justify-between text-[11px] font-medium text-violet-200/80">
						<span>Tier Saat Ini</span>
						<span>Berikutnya: {summary.nextTier}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- ================= CONTROLS (TABS & SEARCH) ================= -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<!-- Tabs -->
			<div class="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
				{#each [{ id: 'all', label: 'Semua' }, { id: 'unlocked', label: 'Terbuka' }, { id: 'writing', label: 'Menulis' }, { id: 'reading', label: 'Membaca' }] as tab}
					<button
						onclick={() => (activeTab = tab.id as typeof activeTab)}
						class={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
							activeTab === tab.id
								? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
								: 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
						}`}
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Search Bar -->
			<div class="relative w-full sm:w-64">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari lencana..."
					class="w-full rounded-xl border border-input bg-card py-2 pr-4 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-violet-500 focus:outline-none sm:text-sm"
				/>
			</div>
		</div>

		<!-- ================= BADGES GRID ================= -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredBadges as badge}
				<div
					class={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 ${
						badge.unlocked
							? 'border-violet-500/30 bg-card shadow-sm hover:border-violet-500/60 hover:shadow-md'
							: 'border-border/60 bg-muted/40 opacity-75'
					}`}
				>
					<!-- Top Row: Icon + Points Badge -->
					<div class="flex items-start justify-between gap-3">
						<!-- Hexagon/Circle Badge Icon Container -->
						<div
							class={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all ${
								badge.unlocked
									? 'border-violet-400/30 bg-violet-500/10 text-violet-600 dark:text-violet-400'
									: 'border-border bg-muted text-muted-foreground'
							}`}
						>
							{#if badge.icon === 'pen'}
								<PenTool class="h-6 w-6" />
							{:else if badge.icon === 'sparkles'}
								<Sparkles class="h-6 w-6" />
							{:else if badge.icon === 'award'}
								<Award class="h-6 w-6" />
							{:else if badge.icon === 'book'}
								<BookOpen class="h-6 w-6" />
							{:else if badge.icon === 'flame'}
								<Flame class="h-6 w-6" />
							{:else}
								<Trophy class="h-6 w-6" />
							{/if}

							<!-- Lock Badge Overlay -->
							{#if !badge.unlocked}
								<div class="absolute -right-1 -bottom-1 rounded-full bg-zinc-800 p-1 text-white">
									<Lock class="h-3 w-3" />
								</div>
							{/if}
						</div>

						<!-- Points Chip -->
						<span
							class={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
								badge.unlocked
									? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
									: 'bg-muted text-muted-foreground'
							}`}
						>
							+{badge.points} PTS
						</span>
					</div>

					<!-- Middle: Content -->
					<div class="my-3 space-y-1">
						<div class="flex items-center gap-1.5">
							<h3 class="text-sm font-bold text-card-foreground sm:text-base">
								{badge.title}
							</h3>
							{#if badge.unlocked}
								<CircleCheck class="h-4 w-4 shrink-0 text-emerald-500" />
							{/if}
						</div>
						<p class="text-xs leading-relaxed text-muted-foreground">
							{badge.description}
						</p>
					</div>

					<!-- Bottom Row: Progress or Unlocked Date -->
					<div class="border-t border-border/40 pt-2">
						{#if badge.unlocked}
							<p class="text-[11px] font-medium text-violet-600 dark:text-violet-400">
								Terbuka pada {badge.unlockedAt}
							</p>
						{:else if badge.progress}
							<div class="space-y-1">
								<div class="flex justify-between text-[11px] font-semibold text-muted-foreground">
									<span>Progres</span>
									<span>{badge.progress.current} / {badge.progress.max}</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
									<div
										class="h-full rounded-full bg-violet-500"
										style:width="{(badge.progress.current / badge.progress.max) * 100}%"
									></div>
								</div>
							</div>
						{:else}
							<p class="text-[11px] font-medium text-muted-foreground">Terkunci</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</main>
</div>
