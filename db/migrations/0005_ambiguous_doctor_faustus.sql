ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "verification_tokens" DROP CONSTRAINT "verification_tokens_token_hash_unique";--> statement-breakpoint
ALTER TABLE "verification_tokens" ALTER COLUMN "token_hash" SET DATA TYPE varchar;