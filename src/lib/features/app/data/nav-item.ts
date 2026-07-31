import { Award, BookOpen, House, Map, Store, User } from '@lucide/svelte';
import type { NavItem } from '$lib/features/app/types';

export const navItems: NavItem[] = [
	{ href: '/app/home', label: 'Beranda', icon: House, name: 'home' },
	{ href: '/app/journey', label: 'Perjalanan', icon: Map, name: 'journey' },
	{ href: '/app/badges', label: 'Badge', icon: Award, name: 'badges' },
	{ href: '/app/shop', label: 'Toko', icon: Store, name: 'shop' },
	{ href: '/app/profile', label: 'Profil', icon: User, name: 'profile' },
	{ href: '/app/story-studio', label: 'Story Studio', icon: BookOpen, name: 'story-studio' }
];

export const mobileNavIems: NavItem[] = [
	{ href: '/app/home', label: 'Beranda', icon: House, name: 'home' },
	{ href: '/app/journey', label: 'Perjalanan', icon: Map, name: 'journey' },
	{ href: '/app/badges', label: 'Badge', icon: Award, name: 'badge' },
	{ href: '/app/shop', label: 'Toko', icon: Store, name: 'shop' },
	{ href: '/app/profile', label: 'Profil', icon: User, name: 'profile' }
];
