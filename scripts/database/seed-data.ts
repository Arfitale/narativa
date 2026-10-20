/**
 * Data seed Narativa (TEST DATA untuk pengembangan, Section 1-2).
 * Lokasi yang disarankan: scripts/seed-data.ts
 * Cocok dengan schema.ts + content-types.ts versi awal.
 *
 * buildSeed() murni (tanpa akses DB). UUID dibuat di aplikasi sehingga baris
 * node_prerequisites bisa dibuat tanpa insert bertahap.
 *
 * Isi materi hanyalah PLACEHOLDER. Kunci jawaban (node_answer_keys) hanya
 * untuk menguji alur penilaian di server dan tidak pernah masuk nodes.content.
 */
import type {
	learningPaths,
	nodeAnswerKeys,
	nodePrerequisites,
	nodes,
	sections
} from '../../src/lib/features/database/schema/schema';
import type {
	ActivityItem,
	AnswerKey,
	ItemAnswerKey,
	NodeContent
} from '../../src/lib/features/database/schema/content-types';

type NodeType = (typeof nodes.$inferInsert)['type'];

type NodeSeed = {
	code: string; // nomor tampilan; hanya untuk label placeholder (tidak disimpan)
	title: string;
	type: NodeType;
	required: boolean; // W = true, O = false
};

type SectionSeed = { title: string; description: string; nodes: NodeSeed[] };

const PATH_SLUG = 'menulis-cerpen';
const CHECKPOINT_PASSING_SCORE = 70;

const SECTIONS: SectionSeed[] = [
	{
		title: 'Fondasi Cerpen dan Pengalaman Membaca',
		description: 'Mengenal cerpen dan membiasakan diri membaca cerpen secara aktif.',
		nodes: [
			{ code: '1.1', title: 'Masuk ke Narativa', type: 'dialogue', required: true },
			{ code: '1.2', title: 'Apa itu cerpen?', type: 'learn', required: true },
			{
				code: '1.3',
				title: 'Membaca cerpen contoh dan menandai ciri',
				type: 'practice',
				required: true
			},
			{ code: '1.4', title: 'Jenis dan fungsi cerpen', type: 'learn', required: true },
			{ code: '1.5', title: 'Cerpen vs nonfiksi naratif', type: 'practice', required: true },
			{ code: '1.6', title: 'Jejak sejarah cerpen', type: 'learn', required: false },
			{ code: '1.7', title: 'Checkpoint Fondasi', type: 'checkpoint', required: true }
		]
	},
	{
		title: 'Struktur Cerpen',
		description: 'Memahami dan memetakan orientasi, komplikasi, dan resolusi.',
		nodes: [
			{ code: '2.1', title: 'Orientasi, komplikasi, resolusi', type: 'learn', required: true },
			{ code: '2.2', title: 'Memetakan struktur cerpen contoh', type: 'practice', required: true },
			{ code: '2.3', title: 'Susun ulang peristiwa', type: 'game', required: true },
			{ code: '2.4', title: 'Konflik dan variasi akhir cerita', type: 'learn', required: true },
			{ code: '2.5', title: 'Checkpoint Struktur', type: 'checkpoint', required: true }
		]
	}
];

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// ---------- Pembuat konten placeholder ----------

type Built = { content: NodeContent; answerKey?: AnswerKey; passingScore?: number };

const OPTION_IDS = ['a', 'b', 'c'] as const;

/** Pilihan ganda; jawaban benar diputar (a/b/c) agar tidak selalu sama saat menguji UI. */
function singleChoice(
	n: NodeSeed,
	i: number,
	reviewNodeSlug?: string
): { item: ActivityItem; key: ItemAnswerKey } {
	const id = `q${i + 1}`;
	const correct = OPTION_IDS[i % OPTION_IDS.length];
	return {
		item: {
			id,
			type: 'single_choice',
			prompt: `[PLACEHOLDER ${n.code}] Pertanyaan ${i + 1}?`,
			options: OPTION_IDS.map((o) => ({ id: o, text: `Opsi ${o.toUpperCase()}` }))
		},
		key: {
			type: 'single_choice',
			correctOptionId: correct,
			points: 1,
			explanation: `[PLACEHOLDER] Opsi ${correct.toUpperCase()} benar.`,
			reviewNodeSlug
		}
	};
}

function buildQuiz(n: NodeSeed, count: number, reviewNodeSlug?: string): Built {
	const parts = Array.from({ length: count }, (_, i) => singleChoice(n, i, reviewNodeSlug));
	return {
		content: {
			kind: 'activity',
			instructions: `[PLACEHOLDER ${n.code}] Petunjuk pengerjaan.`,
			items: parts.map((p) => p.item)
		},
		answerKey: { items: Object.fromEntries(parts.map((p, i) => [`q${i + 1}`, p.key])) }
	};
}

/** Urutan di content sengaja diacak; urutan benar hanya ada di kunci jawaban. */
function buildOrdering(n: NodeSeed, reviewNodeSlug?: string): Built {
	return {
		content: {
			kind: 'activity',
			instructions: `[PLACEHOLDER ${n.code}] Susun peristiwa berikut dengan urutan yang benar.`,
			shuffleItems: true,
			items: [
				{
					id: 'q1',
					type: 'ordering',
					prompt: '[PLACEHOLDER] Susun peristiwa.',
					items: [
						{ id: 'e3', text: 'Peristiwa penutup (resolusi)' },
						{ id: 'e1', text: 'Peristiwa pembuka (orientasi)' },
						{ id: 'e2', text: 'Peristiwa puncak (komplikasi)' }
					]
				}
			]
		},
		answerKey: {
			items: {
				q1: {
					type: 'ordering',
					correctOrder: ['e1', 'e2', 'e3'],
					points: 1,
					explanation: '[PLACEHOLDER] Orientasi, komplikasi, lalu resolusi.',
					reviewNodeSlug
				}
			}
		}
	};
}

function buildNode(n: NodeSeed, reviewNodeSlug?: string): Built {
	const tag = `[PLACEHOLDER ${n.code}]`;
	switch (n.type) {
		case 'dialogue':
			return {
				content: {
					kind: 'dialogue',
					lines: [
						{ id: 'l1', speaker: 'Pemandu', text: `${tag} Halo, selamat datang!` },
						{ id: 'l2', speaker: 'Pemandu', text: `${tag} Mari kita mulai.` }
					]
				}
			};
		case 'learn':
			return {
				content: {
					kind: 'reading',
					blocks: [
						{ type: 'heading', text: n.title },
						{
							type: 'paragraph',
							text: `${tag} Isi materi akan diganti setelah divalidasi ahli materi.`
						}
					]
				}
			};
		case 'game':
			return buildOrdering(n, reviewNodeSlug);
		case 'checkpoint':
			return { ...buildQuiz(n, 3, reviewNodeSlug), passingScore: CHECKPOINT_PASSING_SCORE };
		default:
			return buildQuiz(n, 2, reviewNodeSlug);
	}
}

// ---------- Hasil ----------

export type SeedRows = {
	pathSlug: string;
	path: typeof learningPaths.$inferInsert;
	sections: (typeof sections.$inferInsert)[];
	nodes: (typeof nodes.$inferInsert)[];
	prerequisites: (typeof nodePrerequisites.$inferInsert)[];
	answerKeys: (typeof nodeAnswerKeys.$inferInsert)[];
};

/**
 * Aturan prasyarat (edge di node_prerequisites; node terbuka jika SEMUA prasyaratnya completed):
 *  - Node wajib (W) mensyaratkan node wajib sebelumnya (lintas section).
 *  - Node opsional (O) mensyaratkan node wajib sebelumnya, tetapi TIDAK menjadi
 *    prasyarat siapa pun, sehingga tidak menghalangi jalur utama.
 * Untuk data uji ini bentuknya linear (satu edge per node); syarat jamak
 * cukup dengan menambah baris edge.
 */
export function buildSeed(): SeedRows {
	const pathId = crypto.randomUUID();
	const sectionRows: SeedRows['sections'] = [];
	const nodeRows: SeedRows['nodes'] = [];
	const prereqRows: SeedRows['prerequisites'] = [];
	const keyRows: SeedRows['answerKeys'] = [];
	const slugs = new Set<string>();

	let lastRequiredNodeId: string | null = null;

	SECTIONS.forEach((s, si) => {
		const sectionId = crypto.randomUUID();
		sectionRows.push({
			id: sectionId,
			pathId,
			slug: slugify(s.title),
			title: s.title,
			description: s.description,
			position: si + 1,
			isPublished: true
		});

		// Node yang diarahkan saat jawaban salah: node LEARN pertama di section ini.
		const firstLearn = s.nodes.find((n) => n.type === 'learn');
		const reviewSlug = firstLearn ? slugify(firstLearn.title) : undefined;

		s.nodes.forEach((n, ni) => {
			const slug = slugify(n.title);
			if (slugs.has(slug)) throw new Error(`Slug duplikat: ${slug}`);
			slugs.add(slug);

			const built = buildNode(n, reviewSlug);
			const nodeId = crypto.randomUUID();
			nodeRows.push({
				id: nodeId,
				sectionId,
				slug,
				title: n.title,
				type: n.type,
				isRequired: n.required,
				position: ni + 1,
				content: built.content,
				passingScore: built.passingScore ?? null,
				isPublished: true
			});
			if (built.answerKey) keyRows.push({ nodeId, answerKey: built.answerKey });
			if (lastRequiredNodeId) prereqRows.push({ nodeId, requiredNodeId: lastRequiredNodeId });

			if (n.required) lastRequiredNodeId = nodeId;
		});
	});

	return {
		pathSlug: PATH_SLUG,
		path: {
			id: pathId,
			slug: PATH_SLUG,
			title: 'Menulis Cerpen',
			description: 'Jalur belajar membaca dan menulis cerpen (data uji).',
			contentLabel: 'v0.1-test',
			isPublished: true
		},
		sections: sectionRows,
		nodes: nodeRows,
		prerequisites: prereqRows,
		answerKeys: keyRows
	};
}
