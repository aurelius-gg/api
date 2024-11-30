DROP TABLE "user_tokens" CASCADE;--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "refresh_token" TO "authorization_token";