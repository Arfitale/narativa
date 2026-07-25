import type { SvelteComponent } from 'svelte';

export interface ChapterProgress {
	chapterLabel: string;
	title: string;
	percent: number; // 0-100
}

export interface JourneyNode {
	label: string;
	status: 'done' | 'current' | 'upcoming';
}

export interface BadgeItem {
	icon: 'book' | 'search' | 'flame' | 'trophy';
	label: string;
	description?: string;
	unlocked: boolean;
}

export interface NavItem {
	href: string;
	label: string;
	icon: Component;
	name?: string; // Optional property to specify the active URL for the navigation item
}
