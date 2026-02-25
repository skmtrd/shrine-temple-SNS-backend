CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporter_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT '未対応' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"condition_type" text NOT NULL,
	"condition_value" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_id" integer NOT NULL,
	"awarded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pilgrimage_impressions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"route_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pilgrimage_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"creator_id" uuid,
	"name" text NOT NULL,
	"alias" text,
	"description" text,
	"area" text,
	"type_tag" text,
	"religion" text,
	"blessing_tags" text,
	"is_public" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "route_temples" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" integer NOT NULL,
	"temple_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_pilgrimages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"route_id" integer NOT NULL,
	"status" text NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"temple_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer NOT NULL,
	"parent_comment_id" integer,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "temple_news" (
	"id" serial PRIMARY KEY NOT NULL,
	"temple_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"url" text,
	"category_tag" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visit_histories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"temple_id" integer NOT NULL,
	"content" text,
	"visit_date" timestamp with time zone NOT NULL,
	"is_goshuin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visit_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"visit_history_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"is_goshuin_image" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "temple_aliases" (
	"id" serial PRIMARY KEY NOT NULL,
	"temple_id" integer NOT NULL,
	"alias_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "temple_edit_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"temple_id" integer NOT NULL,
	"requester_id" uuid NOT NULL,
	"field_name" text NOT NULL,
	"new_value" text,
	"status" text DEFAULT '未対応' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "temple_facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"temple_id" integer NOT NULL,
	"visiting_hours" text,
	"admission_fee" text,
	"parking_info" text,
	"access_info" text,
	"prayer_info" text,
	"goshuin_info" text,
	"cashless_info" text,
	"toilet_info" text,
	"barrier_free_info" text,
	"shukubo_info" text,
	"charms_info" text,
	CONSTRAINT "temple_facilities_temple_id_unique" UNIQUE("temple_id")
);
--> statement-breakpoint
CREATE TABLE "temple_officials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"temple_id" integer NOT NULL,
	"status" text DEFAULT '申請中' NOT NULL,
	"applicant_name" text NOT NULL,
	"contact_info" text NOT NULL,
	"registry_image_url" text NOT NULL,
	"approved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "temples" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"category" text,
	"religion" text,
	"sect" text,
	"address" text NOT NULL,
	"phone" text,
	"map_url" text,
	"history" text,
	"area" text,
	"old_province" text,
	"has_cultural_property" boolean DEFAULT false NOT NULL,
	"blessing_tags" text,
	"deity" text,
	"is_locked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" text DEFAULT '一般' NOT NULL,
	"email" text NOT NULL,
	"display_id" text NOT NULL,
	"username" text NOT NULL,
	"profile_image" text,
	"bio" text,
	"name" text,
	"address" text,
	"gender" text,
	"age" integer,
	"favorite_temple_id" integer,
	"main_route_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_display_id_unique" UNIQUE("display_id")
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrimage_impressions" ADD CONSTRAINT "pilgrimage_impressions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrimage_impressions" ADD CONSTRAINT "pilgrimage_impressions_route_id_pilgrimage_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."pilgrimage_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrimage_routes" ADD CONSTRAINT "pilgrimage_routes_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_temples" ADD CONSTRAINT "route_temples_route_id_pilgrimage_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."pilgrimage_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_temples" ADD CONSTRAINT "route_temples_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pilgrimages" ADD CONSTRAINT "user_pilgrimages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pilgrimages" ADD CONSTRAINT "user_pilgrimages_route_id_pilgrimage_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."pilgrimage_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_news" ADD CONSTRAINT "temple_news_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_histories" ADD CONSTRAINT "visit_histories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_histories" ADD CONSTRAINT "visit_histories_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_photos" ADD CONSTRAINT "visit_photos_visit_history_id_visit_histories_id_fk" FOREIGN KEY ("visit_history_id") REFERENCES "public"."visit_histories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_aliases" ADD CONSTRAINT "temple_aliases_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_edit_requests" ADD CONSTRAINT "temple_edit_requests_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_edit_requests" ADD CONSTRAINT "temple_edit_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_facilities" ADD CONSTRAINT "temple_facilities_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_officials" ADD CONSTRAINT "temple_officials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_officials" ADD CONSTRAINT "temple_officials_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;