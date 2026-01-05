CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "authenticators" (
	"credential_id" text NOT NULL,
	"user_id" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"credential_public_key" text NOT NULL,
	"counter" integer NOT NULL,
	"credential_device_type" text NOT NULL,
	"credential_backed_up" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticators_user_id_credential_id_pk" PRIMARY KEY("user_id","credential_id"),
	CONSTRAINT "authenticators_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "app_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"app_id" text NOT NULL,
	"data" jsonb NOT NULL,
	"last_synced_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_app_unique" UNIQUE("user_id","app_id")
);
--> statement-breakpoint
CREATE TABLE "app_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"progress_id" text NOT NULL,
	"type" text NOT NULL,
	"amount" integer,
	"item_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gaming_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"handle" text NOT NULL,
	"show_on_leaderboards" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gaming_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "gaming_profiles_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"gaming_profile_id" text NOT NULL,
	"app_id" text NOT NULL,
	"score" bigint NOT NULL,
	"score_type" text DEFAULT 'high_score' NOT NULL,
	"additional_stats" jsonb,
	"achieved_at" timestamp DEFAULT now() NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_unique" UNIQUE("gaming_profile_id","app_id","score_type")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_progress" ADD CONSTRAINT "app_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_transactions" ADD CONSTRAINT "app_transactions_progress_id_app_progress_id_fk" FOREIGN KEY ("progress_id") REFERENCES "public"."app_progress"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gaming_profiles" ADD CONSTRAINT "gaming_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_gaming_profile_id_gaming_profiles_id_fk" FOREIGN KEY ("gaming_profile_id") REFERENCES "public"."gaming_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "app_progress_user_idx" ON "app_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_progress_idx" ON "app_transactions" USING btree ("progress_id");--> statement-breakpoint
CREATE INDEX "gaming_profiles_user_idx" ON "gaming_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "gaming_profiles_handle_idx" ON "gaming_profiles" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "leaderboard_app_score_idx" ON "leaderboard_entries" USING btree ("app_id","score");--> statement-breakpoint
CREATE INDEX "leaderboard_app_time_idx" ON "leaderboard_entries" USING btree ("app_id","achieved_at");--> statement-breakpoint
CREATE INDEX "leaderboard_profile_idx" ON "leaderboard_entries" USING btree ("gaming_profile_id");