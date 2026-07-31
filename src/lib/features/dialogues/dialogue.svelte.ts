import { characters } from './character';
import { sceneRegistry, type SceneId } from './registry';
import type { DialogueNode, DialogueScene } from './types';

class DialogueManager {
	visible = $state(false);
	scene = $state<DialogueScene | null>(null);
	currentId = $state('');
	currentNodeId = $state('');

	private nodeMap = new Map<string, DialogueNode>();

	start(sceneId: SceneId) {
		const newScene = sceneRegistry[sceneId];
		this.scene = newScene;
		this.nodeMap = new Map(newScene.nodes.map((node) => [node.id, node]));
		this.currentNodeId = newScene.start;
		this.visible = true;
	}

	get currentNode() {
		return this.nodeMap.get(this.currentNodeId);
	}

	get currentCharacter() {
		const node = this.currentNode;
		if (!node) return null;
		return characters[node.character];
	}

	get canAdvance() {
		return !this.currentNode?.choices?.length;
	}

	next() {
		const node = this.currentNode;
		if (!node) return;

		// End of scene
		if (!node.next) {
			this.close();
			return;
		}

		this.currentNodeId = node.next;
	}

	close() {
		this.visible = false;
		this.scene = null;
	}
}

export const dialogue = new DialogueManager();
