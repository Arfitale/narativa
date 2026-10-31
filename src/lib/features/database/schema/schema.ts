import { sql } from 'drizzle-orm';
import {
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid
} from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import type {
	AnswerKey,
	AttemptItemResults,
	AttemptResponses,
	NodeContent,
	RubricScores,
	StoryPlan
} from './content-types';

export const nodeType = pgEnum('node_type', [
	'learn',
	'practice',
	'game',
	'dialogue',
	'checkpoint',
	'final'
]);
export const progressStatus = pgEnum('progress_status', ['in_progress', 'completed']);
export const attemptStatus = pgEnum('attempt_status', ['in_progress', 'submitted']);
export const snapshotStage = pgEnum('snapshot_stage', ['initial', 'revised']);
export const reviewSource = pgEnum('review_source', ['self', 'teacher']);

const timestamps = {
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};

export const learningPaths = pgTable('learning_paths', {
	id: uuid().primaryKey().defaultRandom(),
	slug: text().notNull().unique(),
	title: text().notNull(),
	description: text(),
	contentLabel: text().notNull().default('v0.1'), // label versi materi, mis. untuk laporan penelitian
	isPublished: boolean().notNull().default(false),
	...timestamps
}).enableRLS();

export const sections = pgTable(
	'sections',
	{
		id: uuid().primaryKey().defaultRandom(),
		pathId: uuid()
			.notNull()
			.references(() => learningPaths.id, { onDelete: 'cascade' }),
		slug: text().notNull(),
		title: text().notNull(),
		description: text(),
		position: integer().notNull(),
		isPublished: boolean().notNull().default(true),
		...timestamps
	},
	(t) => [
		unique('sections_path_slug_uq').on(t.pathId, t.slug),
		index('sections_path_position_idx').on(t.pathId, t.position),
		check('sections_position_positive', sql`${t.position} > 0`)
	]
).enableRLS();

export const nodes = pgTable(
	'nodes',
	{
		id: uuid().primaryKey().defaultRandom(),
		sectionId: uuid()
			.notNull()
			.references(() => sections.id, { onDelete: 'cascade' }),
		slug: text().notNull().unique(),
		title: text().notNull(),
		type: nodeType().notNull(),
		isRequired: boolean().notNull().default(true),
		position: integer().notNull(),
		version: integer().notNull().default(1),
		content: jsonb().$type<NodeContent>().notNull(),
		passingScore: integer(),
		isPublished: boolean().notNull().default(true),
		...timestamps
	},
	(t) => [
		index('nodes_section_position_idx').on(t.sectionId, t.position),
		check('nodes_position_positive', sql`${t.position} > 0`),
		check(
			'nodes_passing_score_range',
			sql`${t.passingScore} is null or (${t.passingScore} between 0 and 100)`
		)
	]
).enableRLS();

export const nodePrerequisites = pgTable(
	'node_prerequisites',
	{
		nodeId: uuid()
			.notNull()
			.references(() => nodes.id, { onDelete: 'cascade' }),
		requiredNodeId: uuid()
			.notNull()
			.references(() => nodes.id, { onDelete: 'restrict' })
	},
	(t) => [
		primaryKey({ columns: [t.nodeId, t.requiredNodeId] }),
		index('node_prerequisites_required_idx').on(t.requiredNodeId),
		check('node_prerequisites_not_self', sql`${t.nodeId} <> ${t.requiredNodeId}`)
	]
).enableRLS();

export const nodeAnswerKeys = pgTable('node_answer_keys', {
	nodeId: uuid()
		.primaryKey()
		.references(() => nodes.id, { onDelete: 'cascade' }),
	answerKey: jsonb().$type<AnswerKey>().notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
}).enableRLS();

export const profiles = pgTable('profiles', {
	id: uuid()
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	displayName: text().notNull(),
	isOnboarded: boolean().notNull().default(false),
	...timestamps
}).enableRLS();

export const nodeProgress = pgTable(
	'node_progress',
	{
		userId: uuid()
			.notNull()
			.references(() => authUsers.id, { onDelete: 'cascade' }),
		nodeId: uuid()
			.notNull()
			.references(() => nodes.id, { onDelete: 'cascade' }),
		status: progressStatus().notNull().default('in_progress'),
		bestScore: integer(),
		completedAt: timestamp({ withTimezone: true }),
		lastActivityAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.nodeId] }),
		index('node_progress_node_idx').on(t.nodeId),
		check(
			'node_progress_completed_consistent',
			sql`(${t.status} = 'completed') = (${t.completedAt} is not null)`
		)
	]
).enableRLS();

export const nodeAttempts = pgTable(
	'node_attempts',
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: uuid()
			.notNull()
			.references(() => authUsers.id, { onDelete: 'cascade' }),
		nodeId: uuid()
			.notNull()
			.references(() => nodes.id, { onDelete: 'cascade' }),
		attemptNo: integer().notNull(),
		/** nodes.version saat percobaan dimulai, agar hasil lama tetap bermakna setelah materi berubah. */
		nodeVersion: integer().notNull(),
		status: attemptStatus().notNull().default('in_progress'),
		responses: jsonb().$type<AttemptResponses>(),
		/** Diisi server setelah penilaian. */
		itemResults: jsonb().$type<AttemptItemResults>(),
		score: integer(),
		maxScore: integer(),
		passed: boolean(),
		startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		submittedAt: timestamp({ withTimezone: true })
	},
	(t) => [
		unique('node_attempts_user_node_no_uq').on(t.userId, t.nodeId, t.attemptNo),
		index('node_attempts_user_node_idx').on(t.userId, t.nodeId),
		check('node_attempts_attempt_no_positive', sql`${t.attemptNo} > 0`),
		check(
			'node_attempts_score_range',
			sql`${t.score} is null or (${t.maxScore} is not null and ${t.score} between 0 and ${t.maxScore})`
		),
		check(
			'node_attempts_submitted_has_time',
			sql`${t.status} = 'in_progress' or ${t.submittedAt} is not null`
		)
	]
).enableRLS();

export const storyProjects = pgTable(
	'story_projects',
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: uuid()
			.notNull()
			.references(() => authUsers.id, { onDelete: 'cascade' }),
		pathId: uuid()
			.notNull()
			.references(() => learningPaths.id, { onDelete: 'cascade' }),
		plan: jsonb().$type<StoryPlan>().notNull().default({}),
		...timestamps
	},
	(t) => [unique('story_projects_user_path_uq').on(t.userId, t.pathId)]
).enableRLS();

export const storyDrafts = pgTable(
	'story_drafts',
	{
		projectId: uuid()
			.primaryKey()
			.references(() => storyProjects.id, { onDelete: 'cascade' }),
		title: text().notNull().default(''),
		body: text().notNull().default(''),
		wordCount: integer().notNull().default(0), // dihitung server
		revision: integer().notNull().default(0),
		updatedAt: timestamp({ withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	(t) => [check('story_drafts_counts_nonneg', sql`${t.wordCount} >= 0 and ${t.revision} >= 0`)]
).enableRLS();

export const storySnapshots = pgTable(
	'story_snapshots',
	{
		id: uuid().primaryKey().defaultRandom(),
		projectId: uuid()
			.notNull()
			.references(() => storyProjects.id, { onDelete: 'cascade' }),
		stage: snapshotStage().notNull(),
		title: text().notNull(),
		body: text().notNull(),
		wordCount: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
	},
	(t) => [index('story_snapshots_project_idx').on(t.projectId, t.createdAt)]
).enableRLS();

export const storyReviews = pgTable(
	'story_reviews',
	{
		id: uuid().primaryKey().defaultRandom(),
		snapshotId: uuid()
			.notNull()
			.references(() => storySnapshots.id, { onDelete: 'cascade' }),
		source: reviewSource().notNull().default('self'),
		rubricScores: jsonb().$type<RubricScores>().notNull(),
		totalScore: integer().notNull(),
		passed: boolean().notNull(),
		notes: text(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
	},
	(t) => [index('story_reviews_snapshot_idx').on(t.snapshotId)]
).enableRLS();

export const storySubmissions = pgTable(
	'story_submissions',
	{
		id: uuid().primaryKey().defaultRandom(),
		projectId: uuid()
			.notNull()
			.references(() => storyProjects.id, { onDelete: 'cascade' }),
		snapshotId: uuid()
			.notNull()
			.references(() => storySnapshots.id, { onDelete: 'restrict' }),
		submittedAt: timestamp({ withTimezone: true }).notNull().defaultNow()
	},
	(t) => [unique('story_submissions_project_uq').on(t.projectId)]
).enableRLS();

// ---------- Tipe turunan ----------
export type Node = typeof nodes.$inferSelect;
export type NewNode = typeof nodes.$inferInsert;
export type NodeProgress = typeof nodeProgress.$inferSelect;
export type NodeAttempt = typeof nodeAttempts.$inferSelect;
export type StoryDraft = typeof storyDrafts.$inferSelect;
export type Section = typeof sections.$inferSelect;
