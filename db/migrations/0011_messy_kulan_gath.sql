ALTER TYPE "public"."invitation_status" ADD VALUE 'completed';--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "otp_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "completed_at" timestamp with time zone;