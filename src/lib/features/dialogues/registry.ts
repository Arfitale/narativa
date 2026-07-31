// registry.ts
import { introScene } from './scene/intro';

export const sceneRegistry = {
	intro: introScene
} as const;

export type SceneId = keyof typeof sceneRegistry;
