ALTER TABLE "node_prerequisites" DROP CONSTRAINT "node_prerequisites_required_node_id_nodes_id_fk";
--> statement-breakpoint
ALTER TABLE "node_prerequisites" ADD CONSTRAINT "node_prerequisites_required_node_id_nodes_id_fk" FOREIGN KEY ("required_node_id") REFERENCES "public"."nodes"("id") ON DELETE restrict ON UPDATE no action;