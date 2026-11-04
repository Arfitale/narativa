import type { Node, NodeProgress, Section } from '$lib/features/database/schema/schema'

type Prerequisite = {
    nodeId: string;
    requiredNodeId: string;
};

type NodeState = 'locked' | 'unlocked' | 'current' | 'completed';

type SectionState = 'locked' | 'unlocked' | 'completed';

export function calculateProgression(
    sections: Section[],
    nodes: Node[],
    progress: Pick<NodeProgress, 'nodeId' | 'status'>[],
    prerequisites: Prerequisite[]
) {
    const sortedSections = [...sections].sort(
        (a, b) => a.position - b.position
    );

    const sortedNodes = [...nodes].sort(
        (a, b) => a.position - b.position
    );

    const progressMap = new Map(
        progress.map((p) => [p.nodeId, p.status])
    );

    const prerequisiteMap = new Map<string, string[]>();

    for (const prerequisite of prerequisites) {
        const existing = prerequisiteMap.get(prerequisite.nodeId) ?? [];

        existing.push(prerequisite.requiredNodeId);

        prerequisiteMap.set(prerequisite.nodeId, existing);
    }

    const completed = (nodeId: string) =>
        progressMap.get(nodeId) === 'completed';

    // Calculate section completion
    const sectionCompleted = (sectionId: string) => {
        const requiredNodes = sortedNodes.filter(
            (node) => node.sectionId === sectionId && node.isRequired
        );

        return (
            requiredNodes.length > 0 &&
            requiredNodes.every((node) => completed(node.id))
        );
    };

    // Calculate section states
    const sectionStates = new Map<string, SectionState>();

    for (let i = 0; i < sortedSections.length; i++) {
        const section = sortedSections[i];

        const unlocked =
            i === 0 ||
            sectionCompleted(sortedSections[i - 1].id);

        sectionStates.set(
            section.id,
            !unlocked
                ? 'locked'
                : sectionCompleted(section.id)
                    ? 'completed'
                    : 'unlocked'
        );
    }

    // Calculate node states
    const nodeStates = new Map<string, NodeState>();

    for (const node of sortedNodes) {
        const sectionUnlocked =
            sectionStates.get(node.sectionId) !== 'locked';

        const requiredNodes =
            prerequisiteMap.get(node.id) ?? [];

        const prerequisitesCompleted = requiredNodes.every(completed);

        let state: NodeState;

        if (completed(node.id)) {
            state = 'completed';
        } else if (
            sectionUnlocked &&
            prerequisitesCompleted
        ) {
            state = 'unlocked';
        } else {
            state = 'locked';
        }

        nodeStates.set(node.id, state);
    }

    // Determine current node
    const currentNode = sortedNodes.find(
        (node) =>
            node.isRequired &&
            nodeStates.get(node.id) === 'unlocked'
    );

    if (currentNode) {
        nodeStates.set(currentNode.id, 'current');
    }

    return {
        sections: sortedSections.map((section) => ({
            ...section,
            state: sectionStates.get(section.id)!
        })),

        nodes: sortedNodes.map((node) => ({
            ...node,
            state: nodeStates.get(node.id)!
        })),

        currentNodeId: currentNode?.id ?? null
    };
}