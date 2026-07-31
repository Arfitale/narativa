import type { ChapterNode } from '../app/types';

export interface Unit {
	id: number;
	title: string;
	description: string;
	bannerColor: string; // e.g. "bg-violet-600" or custom gradient
	chapters: ChapterNode[];
}
