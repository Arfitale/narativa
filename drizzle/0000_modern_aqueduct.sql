CREATE TYPE "public"."attempt_status" AS ENUM('in_progress', 'submitted');--> statement-breakpoint
CREATE TYPE "public"."node_type" AS ENUM('learn', 'practice', 'game', 'dialogue', 'checkpoint', 'final');--> statement-breakpoint
CREATE TYPE "public"."progress_status" AS ENUM('in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."review_source" AS ENUM('self', 'teacher');--> statement-breakpoint
CREATE TYPE "public"."snapshot_stage" AS ENUM('initial', 'revised');--> statement-breakpoint
CREATE TABLE "learning_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content_label" text DEFAULT 'v0.1' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "learning_paths_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "learning_paths" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "node_answer_keys" (
	"node_id" uuid PRIMARY KEY NOT NULL,
	"answer_key" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "node_answer_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "node_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"node_id" uuid NOT NULL,
	"attempt_no" integer NOT NULL,
	"node_version" integer NOT NULL,
	"status" "attempt_status" DEFAULT 'in_progress' NOT NULL,
	"responses" jsonb,
	"item_results" jsonb,
	"score" integer,
	"max_score" integer,
	"passed" boolean,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	CONSTRAINT "node_attempts_user_node_no_uq" UNIQUE("user_id","node_id","attempt_no"),
	CONSTRAINT "node_attempts_attempt_no_positive" CHECK ("node_attempts"."attempt_no" > 0),
	CONSTRAINT "node_attempts_score_range" CHECK ("node_attempts"."score" is null or ("node_attempts"."max_score" is not null and "node_attempts"."score" between 0 and "node_attempts"."max_score")),
	CONSTRAINT "node_attempts_submitted_has_time" CHECK ("node_attempts"."status" = 'in_progress' or "node_attempts"."submitted_at" is not null)
);
--> statement-breakpoint
ALTER TABLE "node_attempts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "node_prerequisites" (
	"node_id" uuid NOT NULL,
	"required_node_id" uuid NOT NULL,
	CONSTRAINT "node_prerequisites_node_id_required_node_id_pk" PRIMARY KEY("node_id","required_node_id"),
	CONSTRAINT "node_prerequisites_not_self" CHECK ("node_prerequisites"."node_id" <> "node_prerequisites"."required_node_id")
);
--> statement-breakpoint
ALTER TABLE "node_prerequisites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "node_progress" (
	"user_id" uuid NOT NULL,
	"node_id" uuid NOT NULL,
	"status" "progress_status" DEFAULT 'in_progress' NOT NULL,
	"best_score" integer,
	"completed_at" timestamp with time zone,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "node_progress_user_id_node_id_pk" PRIMARY KEY("user_id","node_id"),
	CONSTRAINT "node_progress_completed_consistent" CHECK (("node_progress"."status" = 'completed') = ("node_progress"."completed_at" is not null))
);
--> statement-breakpoint
ALTER TABLE "node_progress" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"type" "node_type" NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"position" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"content" jsonb NOT NULL,
	"passing_score" integer,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nodes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "nodes_position_positive" CHECK ("nodes"."position" > 0),
	CONSTRAINT "nodes_passing_score_range" CHECK ("nodes"."passing_score" is null or ("nodes"."passing_score" between 0 and 100))
);
--> statement-breakpoint
ALTER TABLE "nodes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"position" integer NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sections_path_slug_uq" UNIQUE("path_id","slug"),
	CONSTRAINT "sections_position_positive" CHECK ("sections"."position" > 0)
);
--> statement-breakpoint
ALTER TABLE "sections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "story_drafts" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_drafts_counts_nonneg" CHECK ("story_drafts"."word_count" >= 0 and "story_drafts"."revision" >= 0)
);
--> statement-breakpoint
ALTER TABLE "story_drafts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "story_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"plan" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_projects_user_path_uq" UNIQUE("user_id","path_id")
);
--> statement-breakpoint
ALTER TABLE "story_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "story_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_id" uuid NOT NULL,
	"source" "review_source" DEFAULT 'self' NOT NULL,
	"rubric_scores" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"passed" boolean NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "story_reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "story_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"stage" "snapshot_stage" NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"word_count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "story_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "story_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"snapshot_id" uuid NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_submissions_project_uq" UNIQUE("project_id")
);
--> statement-breakpoint
ALTER TABLE "story_submissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "node_answer_keys" ADD CONSTRAINT "node_answer_keys_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_attempts" ADD CONSTRAINT "node_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_attempts" ADD CONSTRAINT "node_attempts_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_prerequisites" ADD CONSTRAINT "node_prerequisites_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_prerequisites" ADD CONSTRAINT "node_prerequisites_required_node_id_nodes_id_fk" FOREIGN KEY ("required_node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_progress" ADD CONSTRAINT "node_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_progress" ADD CONSTRAINT "node_progress_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_drafts" ADD CONSTRAINT "story_drafts_project_id_story_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."story_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_projects" ADD CONSTRAINT "story_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_projects" ADD CONSTRAINT "story_projects_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_reviews" ADD CONSTRAINT "story_reviews_snapshot_id_story_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."story_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_snapshots" ADD CONSTRAINT "story_snapshots_project_id_story_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."story_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_submissions" ADD CONSTRAINT "story_submissions_project_id_story_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."story_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_submissions" ADD CONSTRAINT "story_submissions_snapshot_id_story_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."story_snapshots"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "node_attempts_user_node_idx" ON "node_attempts" USING btree ("user_id","node_id");--> statement-breakpoint
CREATE INDEX "node_prerequisites_required_idx" ON "node_prerequisites" USING btree ("required_node_id");--> statement-breakpoint
CREATE INDEX "node_progress_node_idx" ON "node_progress" USING btree ("node_id");--> statement-breakpoint
CREATE INDEX "nodes_section_position_idx" ON "nodes" USING btree ("section_id","position");--> statement-breakpoint
CREATE INDEX "sections_path_position_idx" ON "sections" USING btree ("path_id","position");--> statement-breakpoint
CREATE INDEX "story_reviews_snapshot_idx" ON "story_reviews" USING btree ("snapshot_id");--> statement-breakpoint
CREATE INDEX "story_snapshots_project_idx" ON "story_snapshots" USING btree ("project_id","created_at");