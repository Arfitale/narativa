/**
 * Menjalankan seed. Lokasi yang disarankan: scripts/seed.ts
 * Jalankan: npm run db:seed   (script: "tsx scripts/seed.ts")
 *
 * Idempoten untuk data uji: menghapus edge prasyarat lalu learning path ber-slug sama
 * (cascade ke sections, nodes, kunci jawaban, dan tabel lain yang mereferensikannya,
 * mis. progres dan percobaan), lalu memasukkan ulang, semuanya dalam satu transaksi.
 * JANGAN dijalankan terhadap database yang berisi progres siswa sungguhan.
 */

import { config } from 'dotenv';
config({ path: '.env' });
import { eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
	learningPaths,
	nodeAnswerKeys,
	nodePrerequisites,
	nodes,
	sections
} from '../../src/lib/features/database/schema/schema';
import { buildSeed } from './seed-data';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

// Gunakan koneksi langsung (port 5432) untuk skrip; kompatibel juga dengan pooler.
const client = postgres(url, { max: 1, prepare: false });
const db = drizzle(client, { casing: 'snake_case' });

async function main() {
	const seed = buildSeed();

	await db.transaction(async (tx) => {
		// node_prerequisites.required_node_id memakai ON DELETE RESTRICT (melindungi prasyarat dari
		// penghapusan tak sengaja), jadi edge milik path ini dihapus dulu sebelum path-nya.
		const pathNodeIds = tx
			.select({ id: nodes.id })
			.from(nodes)
			.innerJoin(sections, eq(nodes.sectionId, sections.id))
			.innerJoin(learningPaths, eq(sections.pathId, learningPaths.id))
			.where(eq(learningPaths.slug, seed.pathSlug));
		await tx.delete(nodePrerequisites).where(inArray(nodePrerequisites.nodeId, pathNodeIds));
		await tx.delete(learningPaths).where(eq(learningPaths.slug, seed.pathSlug));

		await tx.insert(learningPaths).values(seed.path);
		await tx.insert(sections).values(seed.sections);
		await tx.insert(nodes).values(seed.nodes);
		await tx.insert(nodePrerequisites).values(seed.prerequisites);
		await tx.insert(nodeAnswerKeys).values(seed.answerKeys);
	});

	console.log(
		`Seed OK: 1 path, ${seed.sections.length} sections, ${seed.nodes.length} nodes, ` +
			`${seed.prerequisites.length} prerequisites, ${seed.answerKeys.length} answer keys`
	);
}

main()
	.catch((err) => {
		console.error('Seed gagal:', err);
		process.exitCode = 1;
	})
	.finally(() => client.end());
