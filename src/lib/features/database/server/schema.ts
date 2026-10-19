import { boolean, integer, jsonb, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { timestamps } from '../utils/pg';
import { relations } from 'drizzle-orm';

export const nodeType = pgEnum('node_type', [
	'learn',
	'practice',
	'game',
	'dialogue',
	'checkpoint',
	'final'
]);

export const profiles = pgTable('profiles', {
	id: uuid()
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	displayName: text().notNull(),
	...timestamps
}).enableRLS();

export const learningPaths = pgTable('learning_paths', {
	id: uuid().primaryKey().defaultRandom(),
	slug: text().notNull().unique(),
	title: text().notNull(),
	description: text(),
	contentLabel: text().notNull().default('v0.1'), // label versi materi, mis. untuk laporan penelitian
	isPublished: boolean().notNull().default(false),
	...timestamps
}).enableRLS();

// 2. Tabel Sections (Kelompok Materi / Tahapan Pembelajaran)
export const sections = pgTable('sections', {
	id: uuid().primaryKey().defaultRandom(),
	learningPathId: uuid('learning_path_id')
		.notNull()
		.references(() => learningPaths.id, { onDelete: 'cascade' }),
	title: text().notNull(),
	description: text(),
	orderIndex: integer('order_index').notNull(), // Menentukan urutan section di learning path
	isPublished: boolean('is_published').notNull().default(false),
	...timestamps
}).enableRLS();

// 3. Tabel Nodes (Unit Pembelajaran / Aktivitas Tunggal)
export const nodes = pgTable('nodes', {
	id: uuid().primaryKey().defaultRandom(),
	sectionId: uuid('section_id')
		.notNull()
		.references(() => sections.id, { onDelete: 'cascade' }),
	slug: text().notNull().unique(), // Untuk routing ramah URL (/node/[slug])
	title: text().notNull(),
	description: text(),
	type: nodeType('type').notNull(), // Kategori teknis node
	orderIndex: integer('order_index').notNull(), // Menentukan urutan node dalam section
	prerequisiteNodeId: uuid('prerequisite_node_id').references((): any => nodes.id, {
		onDelete: 'set null'
	}), // Self-reference prasyarat node
	isRequired: boolean('is_required').notNull().default(true), // Menandai apakah wajib untuk membuka Story Studio
	...timestamps
}).enableRLS();

// 4. Tabel Activities (Isi & Interaksi Spesifik di Dalam Node)
export const activities = pgTable('activities', {
	id: uuid().primaryKey().defaultRandom(),
	nodeId: uuid('node_id')
		.notNull()
		.references(() => nodes.id, { onDelete: 'cascade' }),
	title: text().notNull(),
	orderIndex: integer('order_index').notNull().default(1),
	// Memanfaatkan JSONB untuk fleksibilitas payload antartipe aktivitas (mis. naskah dialog VN, opsi kuis, atau konfigurasi game)
	content: jsonb('content').$type<Record<string, unknown>>().notNull().default({}),
	...timestamps
}).enableRLS();

// ==========================================
// DEFINISI RELASI DRIZZLE ORM
// ==========================================

export const learningPathsRelations = relations(learningPaths, ({ many }) => ({
	sections: many(sections)
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
	learningPath: one(learningPaths, {
		fields: [sections.learningPathId],
		references: [learningPaths.id]
	}),
	nodes: many(nodes)
}));

export const nodesRelations = relations(nodes, ({ one, many }) => ({
	section: one(sections, {
		fields: [nodes.sectionId],
		references: [sections.id]
	}),
	prerequisiteNode: one(nodes, {
		fields: [nodes.prerequisiteNodeId],
		references: [nodes.id],
		relationName: 'node_prerequisites'
	}),
	activities: many(activities)
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
	node: one(nodes, {
		fields: [activities.nodeId],
		references: [nodes.id]
	})
}));
