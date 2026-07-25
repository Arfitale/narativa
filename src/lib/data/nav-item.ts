import { Award, BookOpen, House, Map, User } from '@lucide/svelte';
import type { NavItem } from '../components/app/home/types';

export const navItems: NavItem[] = [
	{ href: '/app/home', label: 'Beranda', icon: House, name: 'home' },
	{ href: '/app/journey', label: 'Perjalanan', icon: Map, name: 'journey' },
	{ href: '/app/badge', label: 'Badge', icon: Award, name: 'badge' },
	{ href: '/app/story-studio', label: 'Story Studio', icon: BookOpen, name: 'story-studio' },
	{ href: '/app/profile', label: 'Profil', icon: User, name: 'profile' }
];

export const mobileNavIems: NavItem[] = [
	{ href: '/app/home', label: 'Beranda', icon: House, name: 'home' },
	{ href: '/app/journey', label: 'Perjalanan', icon: Map, name: 'journey' },
	{ href: '/app/badge', label: 'Badge', icon: Award, name: 'badge' },
	{ href: '/app/profile', label: 'Profil', icon: User, name: 'profile' }
];
