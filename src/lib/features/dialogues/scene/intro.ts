import type { DialogueScene } from '../types';

export const introScene: DialogueScene = {
	id: 'intro',
	start: 'intro-1',
	nodes: [
		{
			id: 'intro-1',
			character: 'ralif',
			text: 'Halo! Selamat datang di Narativa.',
			next: 'intro-2'
		},
		{
			id: 'intro-2',
			character: 'ralif',
			text: 'Sebelum mulai, yuk kita berkenalan dulu!'
		}
	]
};
