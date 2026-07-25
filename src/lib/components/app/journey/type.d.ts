export type ChapterStatus = 'completed' | 'active' | 'locked';
export type ChapterType = 'material' | 'activity' | 'challenge';

export interface ChapterNode {
	id: number;
	title: string;
	type: ChapterType;
	status: ChapterStatus;
	offsetX: number;
}

export interface Unit {
	id: number;
	title: string;
	description: string;
	bannerColor: string; // e.g. "bg-violet-600" or custom gradient
	chapters: ChapterNode[];
}
