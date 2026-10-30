import { eq, asc, and, inArray } from 'drizzle-orm';
import { db } from '$lib/features/database/server/index';
import {
	learningPaths,
	sections,
	nodes,
	nodePrerequisites,
	nodeProgress
} from '$lib/features/database/schema/schema';

export async function getLearningTrack(slug: string) {
	const [path] = await db
		.select({
			id: learningPaths.id,
			slug: learningPaths.slug,
			title: learningPaths.title,
			description: learningPaths.description,
			contentLabel: learningPaths.contentLabel
		})
		.from(learningPaths)
		.where(and(eq(learningPaths.slug, slug), eq(learningPaths.isPublished, true)))
		.limit(1);

	if (!path) return null;

	const sectionRows = await db
		.select({
			id: sections.id,
			slug: sections.slug,
			title: sections.title,
			description: sections.description,
			position: sections.position
		})
		.from(sections)
		.where(and(eq(sections.pathId, path.id), eq(sections.isPublished, true)))
		.orderBy(asc(sections.position));

	if (sectionRows.length === 0) {
		return { ...path, sections: [] };
	}

	const nodeRows = await db
		.select({
			id: nodes.id,
			sectionId: nodes.sectionId,
			slug: nodes.slug,
			title: nodes.title,
			type: nodes.type,
			isRequired: nodes.isRequired,
			position: nodes.position,
			version: nodes.version,
			passingScore: nodes.passingScore
		})
		.from(nodes)
		.where(
			and(
				eq(nodes.isPublished, true),
				inArray(
					nodes.sectionId,
					sectionRows.map((section) => section.id)
				)
			)
		)
		.orderBy(asc(nodes.position));

	return {
		...path,
		sections: sectionRows.map((section) => ({
			...section,
			nodes: nodeRows.filter((node) => node.sectionId === section.id)
		}))
	};
}

export async function getNodeBySlug(nodeSlug: string) {
	const [node] = await db
		.select()
		.from(nodes)
		.where(and(eq(nodes.slug, nodeSlug), eq(nodes.isPublished, true)))
		.limit(1);

	if (!node) return null;

	return node;
}

export async function isNodeUnlocked(userId: string, nodeId: string) {
	const [node] = await db.select().from(nodes).where(eq(nodes.id, nodeId));

	if (!node) return false;

	const prerequisites = await db
		.select()
		.from(nodePrerequisites)
		.where(eq(nodePrerequisites.nodeId, nodeId));

	if (prerequisites.length === 0) return true;

	const [currentNodeProgress] = await db
		.select()
		.from(nodeProgress)
		.where(and(eq(nodeProgress.userId, userId), eq(nodeProgress.nodeId, nodeId)));

	if (!currentNodeProgress) return false;

	if (currentNodeProgress.status === 'completed') return true;
}
