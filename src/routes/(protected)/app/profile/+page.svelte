<script lang="ts">
	import {
		Pencil,
		Flame,
		Zap,
		Shield,
		Award,
		UserPlus,
		Search,
		ChevronRight,
		Heart,
		Gem
	} from '@lucide/svelte';
	import type { UserProfile } from '$lib/types/profile';

	const profile: UserProfile = {
		name: 'AhmadJaya2004',
		username: 'AhmadJaya21',
		joinedDate: 'Joined February 2025',
		followingCount: 0,
		followersCount: 0,
		stats: {
			dayStreak: 0,
			totalXp: 92,
			currentLeague: 'Bronze',
			top3Finishes: 0
		},
		recentAchievements: [
			{ id: '1', title: 'Wildfire', progress: '4/7', icon: 'flame', unlocked: true },
			{ id: '2', title: 'Sage', progress: '2/5', icon: 'zap', unlocked: true }
		]
	};

	let activeSocialTab = $state<'following' | 'followers'>('following');
</script>

<div class="min-h-screen bg-background pb-20 text-foreground">
	<!-- Top Bar Stats (Mobile/Header Status) -->
	<div class="mx-auto flex max-w-5xl items-center justify-end gap-6 px-4 py-3 sm:px-6">
		<div class="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
			<span class="text-base">🇮🇩</span>
		</div>
		<div class="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
			<Flame class="h-4 w-4 fill-current" />
			<span>{profile.stats.dayStreak}</span>
		</div>
		<div class="flex items-center gap-1.5 text-xs font-bold text-sky-500">
			<Gem class="h-4 w-4 fill-current" />
			<span>518</span>
		</div>
		<div class="flex items-center gap-1.5 text-xs font-bold text-rose-500">
			<Heart class="h-4 w-4 fill-current" />
			<span>5</span>
		</div>
	</div>

	<!-- Main Responsive Container -->
	<main class="mx-auto max-w-5xl px-4 sm:px-6">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
			<!-- ================= LEFT COLUMN: MAIN PROFILE ================= -->
			<div class="space-y-8 lg:col-span-7">
				<!-- Avatar Banner Card -->
				<div
					class="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-sky-200/50 bg-sky-100 p-8 dark:border-sky-800/50 dark:bg-sky-950/40"
				>
					<!-- Edit Button -->
					<button
						class="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition hover:bg-muted"
					>
						<Pencil class="h-4 w-4" />
					</button>

					<!-- Avatar Placeholder -->
					<div
						class="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-sky-400 bg-sky-200/60 dark:bg-sky-900/40"
					>
						<span class="text-4xl font-light text-sky-500">+</span>
					</div>
				</div>

				<!-- User Meta Header -->
				<div class="flex items-start justify-between">
					<div class="space-y-1">
						<h1 class="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
							{profile.name}
						</h1>
						<p class="text-xs font-medium text-muted-foreground">
							{profile.username}
						</p>
						<p class="pt-1 text-xs text-muted-foreground">
							{profile.joinedDate}
						</p>

						<!-- Social Metrics -->
						<div class="flex items-center gap-4 pt-2 text-xs font-bold text-sky-500">
							<button class="hover:underline">{profile.followingCount} Following</button>
							<button class="hover:underline">{profile.followersCount} Followers</button>
						</div>
					</div>

					<span class="text-2xl">🇮🇩</span>
				</div>

				<hr class="border-border" />

				<!-- Statistics Section -->
				<div class="space-y-4">
					<h2 class="text-lg font-black tracking-tight text-foreground">Statistics</h2>

					<div class="grid grid-cols-2 gap-4">
						<!-- Day Streak -->
						<div
							class="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
						>
							<Flame class="h-6 w-6 text-zinc-300 dark:text-zinc-600" />
							<div>
								<div class="text-lg font-black">{profile.stats.dayStreak}</div>
								<div class="text-xs font-medium text-muted-foreground">Day streak</div>
							</div>
						</div>

						<!-- Total XP -->
						<div
							class="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
						>
							<Zap class="h-6 w-6 fill-amber-500 text-amber-500" />
							<div>
								<div class="text-lg font-black">{profile.stats.totalXp}</div>
								<div class="text-xs font-medium text-muted-foreground">Total XP</div>
							</div>
						</div>

						<!-- Current League -->
						<div
							class="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
						>
							<Shield class="h-6 w-6 text-amber-700" />
							<div>
								<div class="text-lg font-black">{profile.stats.currentLeague}</div>
								<div class="text-xs font-medium text-muted-foreground">Current league</div>
							</div>
						</div>

						<!-- Top 3 Finishes -->
						<div
							class="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
						>
							<Award class="h-6 w-6 text-zinc-300 dark:text-zinc-600" />
							<div>
								<div class="text-lg font-black">{profile.stats.top3Finishes}</div>
								<div class="text-xs font-medium text-muted-foreground">Top 3 finishes</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Achievements Section -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-black tracking-tight text-foreground">Achievements</h2>
						<a
							href="/achievements"
							class="text-xs font-bold tracking-wider text-sky-500 uppercase hover:underline"
						>
							View All
						</a>
					</div>

					<div class="space-y-3">
						{#each profile.recentAchievements as achievement}
							<div
								class="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm"
							>
								<div class="flex items-center gap-3.5">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"
									>
										<Flame class="h-5 w-5 fill-current" />
									</div>
									<div>
										<h3 class="text-sm font-bold">{achievement.title}</h3>
									</div>
								</div>

								<span class="text-xs font-semibold text-muted-foreground">
									{achievement.progress}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- ================= RIGHT COLUMN: SIDEBAR ================= -->
			<div class="space-y-6 lg:col-span-5">
				<!-- Friends / Social Card -->
				<div class="space-y-5 rounded-3xl border border-border bg-card p-5 shadow-sm">
					<!-- Social Tabs -->
					<div class="grid grid-cols-2 border-b border-border pb-3">
						<button
							onclick={() => (activeSocialTab = 'following')}
							class={`pb-2 text-xs font-extrabold tracking-wider uppercase transition-all ${
								activeSocialTab === 'following'
									? 'border-b-2 border-sky-500 text-sky-500'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							Following
						</button>
						<button
							onclick={() => (activeSocialTab = 'followers')}
							class={`pb-2 text-xs font-extrabold tracking-wider uppercase transition-all ${
								activeSocialTab === 'followers'
									? 'border-b-2 border-sky-500 text-sky-500'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							Followers
						</button>
					</div>

					<!-- Empty Social State Illustration -->
					<div class="flex flex-col items-center space-y-4 py-6 text-center">
						<div class="flex items-center -space-x-2">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-violet-400 text-xs font-bold text-white"
							>
								👩‍🎨
							</div>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-emerald-400 text-xs font-bold text-white"
							>
								👨‍💻
							</div>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-amber-400 text-xs font-bold text-white"
							>
								👩‍🎓
							</div>
						</div>

						<p class="max-w-xs text-xs leading-relaxed font-medium text-muted-foreground">
							Learning is more fun and effective when you connect with others.
						</p>
					</div>
				</div>

				<!-- Add Friends Card -->
				<div class="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
					<h3 class="text-sm font-bold text-foreground">Add friends</h3>

					<div class="space-y-2">
						<!-- Find Friends -->
						<button
							class="flex w-full items-center justify-between rounded-2xl p-3 text-left transition hover:bg-muted"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500"
								>
									<Search class="h-4 w-4" />
								</div>
								<span class="text-xs font-bold">Find friends</span>
							</div>
							<ChevronRight class="h-4 w-4 text-muted-foreground" />
						</button>

						<!-- Invite Friends -->
						<button
							class="flex w-full items-center justify-between rounded-2xl p-3 text-left transition hover:bg-muted"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"
								>
									<UserPlus class="h-4 w-4" />
								</div>
								<span class="text-xs font-bold">Invite friends</span>
							</div>
							<ChevronRight class="h-4 w-4 text-muted-foreground" />
						</button>
					</div>
				</div>

				<!-- Footer Links -->
				<div
					class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase"
				>
					<a href="/about" class="hover:underline">About</a>
					<a href="/blog" class="hover:underline">Blog</a>
					<a href="/store" class="hover:underline">Store</a>
					<a href="/terms" class="hover:underline">Terms</a>
				</div>
			</div>
		</div>
	</main>
</div>
