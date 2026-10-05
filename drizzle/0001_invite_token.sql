ALTER TABLE "groups" ADD COLUMN "invite_token" text;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_invite_token_unique" UNIQUE("invite_token");