ALTER TABLE "media" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "uploaded_at" timestamp with time zone NOT NULL;