/**
 * Tipe untuk kolom jsonb. Ini USULAN untuk materi v0.1, bukan skema final.
 * Karena materi akan divalidasi ahli dan bisa berubah, bentuk konten sengaja
 * disimpan sebagai jsonb bertipe (bukan kolom kaku) agar perubahan materi
 * tidak memerlukan migrasi database.
 *
 * ATURAN KEAMANAN:
 * - `NodeContent` (kolom nodes.content) boleh dikirim ke browser. TIDAK BOLEH
 *   berisi kunci jawaban atau penjelasan jawaban.
 * - `AnswerKey` (tabel node_answer_keys) hanya dibaca server.
 *
 * Idealnya setiap tipe ini punya validator runtime (mis. Valibot/Zod) yang
 * dipakai saat seed/impor konten dan saat membaca jsonb dari DB.
 */

// ---------- Konten publik (aman dikirim ke browser) ----------

export type ContentBlock =
	| { type: 'heading'; text: string }
	| { type: 'paragraph'; text: string }
	| { type: 'excerpt'; title?: string; text: string; source?: string }
	| { type: 'callout'; variant: 'tip' | 'note' | 'warning'; text: string }
	| { type: 'list'; ordered: boolean; items: string[] };

export type DialogueChoice = { id: string; text: string; nextLineId?: string };

export type DialogueLine = {
	id: string;
	speaker: string;
	text: string;
	emotion?: string;
	choices?: DialogueChoice[];
};

export type Option = { id: string; text: string };

export type ActivityItem =
	| { id: string; type: 'single_choice'; prompt: string; options: Option[] }
	| { id: string; type: 'multi_choice'; prompt: string; options: Option[] }
	| { id: string; type: 'ordering'; prompt: string; items: Option[] }
	| { id: string; type: 'matching'; prompt: string; left: Option[]; right: Option[] }
	| { id: string; type: 'short_text'; prompt: string; maxLength?: number };

export type RubricCriterion = {
	id: string;
	label: string;
	description: string;
	maxPoints: number;
};

export type Rubric = { criteria: RubricCriterion[]; passingScore: number };

/** Bidang rencana cerpen (hasil node Section 5, dipakai Story Studio). */
export type StoryPlan = {
	idea?: string;
	pointOfView?: string;
	characters?: string;
	setting?: string;
	conflict?: string;
	orientation?: string;
	complication?: string;
	resolution?: string;
	lifeValue?: string;
};

export type NodeContent =
	| { kind: 'reading'; blocks: ContentBlock[] }
	| { kind: 'dialogue'; lines: DialogueLine[] }
	| {
			kind: 'activity';
			instructions: string;
			passage?: ContentBlock[];
			items: ActivityItem[];
			shuffleItems?: boolean;
	  }
	| {
			kind: 'plan_form';
			instructions: string;
			fields: { key: keyof StoryPlan; label: string; hint?: string }[];
	  }
	| { kind: 'writing'; instructions: string; rubric?: Rubric }
	| { kind: 'rubric_review'; instructions: string; rubric: Rubric };

// ---------- Kunci jawaban (HANYA server) ----------

type ItemKey =
	| { type: 'single_choice'; correctOptionId: string }
	| { type: 'multi_choice'; correctOptionIds: string[] }
	| { type: 'ordering'; correctOrder: string[] }
	| { type: 'matching'; pairs: Record<string, string> } // leftId -> rightId
	| { type: 'short_text'; acceptedAnswers: string[]; caseSensitive?: boolean };

export type ItemAnswerKey = ItemKey & {
	points?: number; // default 1
	explanation?: string; // ditampilkan setelah submit
	reviewNodeSlug?: string; // node yang diarahkan jika salah (bukan jalan buntu)
};

export type AnswerKey = { items: Record<string, ItemAnswerKey> };

// ---------- Data pengguna ----------

/** itemId -> jawaban. Bentuk mengikuti ActivityItem.type. */
export type AttemptResponses = Record<string, string | string[] | Record<string, string>>;

/** itemId -> hasil penilaian server. */
export type AttemptItemResults = Record<string, { correct: boolean; points: number }>;

/** criterionId -> skor. */
export type RubricScores = Record<string, number>;
