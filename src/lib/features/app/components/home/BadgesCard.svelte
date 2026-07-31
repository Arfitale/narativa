<script lang="ts">
	import { Award, BookOpen, Search, Flame, Trophy, Lock, ChevronRight } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { BadgeItem } from '$lib/features/app/types';

	interface Props {
		badges: BadgeItem[];
		viewAllHref?: string;
		maxDisplay?: number;
	}

	let { badges, viewAllHref = '/profil', maxDisplay = 6 }: Props = $props();

	// Map icon names to components with a safe fallback
	const iconMap: Record<string, Component<{ class?: string }>> = {
		book: BookOpen,
		search: Search,
		flame: Flame,
		trophy: Trophy,
		award: Award
	};

	// Slice badges for preview if maxDisplay is set
	let displayedBadges = $derived(badges.slice(0, maxDisplay));
	let totalEarned = $derived(badges.filter((b) => b.unlocked ?? true).length);
</script>

<div class="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
	<!-- Header Section -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
				<Award class="h-4 w-4 text-primary" />
				<span>Badge</span>
			</div>
			{#if badges.length > 0}
				<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
					{totalEarned}/{badges.length}
				</span>
			{/if}
		</div>

		<a
			href={viewAllHref}
			class="group inline-flex items-center gap-0.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
		>
			<span>Lihat semua</span>
			<ChevronRight class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
		</a>
	</div>

	<!-- Badges Grid -->
	{#if badges.length === 0}
		<div class="mt-6 py-4 text-center text-xs text-muted-foreground">
			Belum ada badge yang didapatkan
		</div>
	{:else}
		<div class="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
			{#each displayedBadges as badge (badge.label)}
				{@const IconComponent = iconMap[badge.icon] || Award}
				{@const isUnlocked = badge.unlocked ?? true}

				<div class="group relative flex flex-col items-center">
					<!-- Badge Icon Container -->
					<div
						class={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 group-hover:scale-105 ${
							isUnlocked
								? 'border-primary/20 bg-primary/10 text-primary shadow-xs'
								: 'border-border/60 bg-muted/50 text-muted-foreground/40'
						}`}
					>
						<IconComponent class={`h-5 w-5 ${!isUnlocked ? 'grayscale' : ''}`} />

						<!-- Lock Overlay Badge -->
						{#if !isUnlocked}
							<div
								class="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground"
							>
								<Lock class="h-2.5 w-2.5" />
							</div>
						{/if}
					</div>

					<!-- Truncated Label Below Badge -->
					<span
						class="mt-1.5 w-full truncate text-center text-[11px] leading-tight font-medium text-muted-foreground group-hover:text-foreground"
					>
						{badge.label}
					</span>

					<!-- Hover Tooltip Card (Mobile-friendly popover) -->
					<div
						class="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-border bg-popover px-2.5 py-1 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-all duration-150 group-hover:-top-11 group-hover:opacity-100"
					>
						<p class="font-medium">{badge.label}</p>
						{#if badge.description}
							<p class="text-[10px] text-muted-foreground">{badge.description}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
