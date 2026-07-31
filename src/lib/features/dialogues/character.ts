import ralifImage from '$lib/assets/chars/char-ralif.png';
import type { DialogueCharacter } from './types';

export const characters: Record<string, DialogueCharacter> = {
	ralif: {
		id: 'ralif',
		name: 'Ralif',
		image: ralifImage
	}
};
