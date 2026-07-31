export type CharacterPosition = 'left' | 'center' | 'right';

export interface DialogueCharacter {
	/** Unique identifier */
	id: string;
	/** Display name */
	name: string;
	/** Default portrait */
	image: string;
	/** Default screen position */
	position?: CharacterPosition;
}

export interface DialogueChoice {
	/** Text displayed on the button */
	text: string;
	/** Target dialogue node */
	next: string;
}

export interface DialogueNode {
	/** Unique node id */
	id: string;
	/** Character id (references DialogueCharacter.id) */
	character: string;
	/** Dialogue text */
	text: string;
	/** Optional portrait override */
	expression?: string;
	/** Next node id */
	next?: string;
	/** Branching choices */
	choices?: DialogueChoice[];
}

export interface DialogueScene {
	/** Scene id */
	id: string;
	/** First node id */
	start: string;
	/** All dialogue nodes */
	nodes: DialogueNode[];
	/** Future metadata */
	background?: string;
	music?: string;
}
