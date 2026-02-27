CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"condition_type" text NOT NULL,
	"condition_value" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "badges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"temple_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pilgrimage_impressions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"route_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pilgrimage_impressions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "pilgrimage_routes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "route_temples" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" integer NOT NULL,
	"temple_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "route_temples" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "temple_aliases" (
	"id" serial PRIMARY KEY NOT NULL,
	"temple_id" integer NOT NULL,
	"alias_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "temple_aliases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "temple_edit_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "temple_facilities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "temple_news" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "temple_officials" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "temples" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_id" integer NOT NULL,
	"awarded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_badges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_pilgrimages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"route_id" integer NOT NULL,
	"status" text NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_pilgrimages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "visit_histories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "visit_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"visit_history_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"is_goshuin_image" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "visit_photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrimage_impressions" ADD CONSTRAINT "pilgrimage_impressions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrimage_impressions" ADD CONSTRAINT "pilgrimage_impressions_route_id_pilgrimage_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."pilgrimage_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrimage_routes" ADD CONSTRAINT "pilgrimage_routes_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_temples" ADD CONSTRAINT "route_temples_route_id_pilgrimage_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."pilgrimage_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_temples" ADD CONSTRAINT "route_temples_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_aliases" ADD CONSTRAINT "temple_aliases_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_edit_requests" ADD CONSTRAINT "temple_edit_requests_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_edit_requests" ADD CONSTRAINT "temple_edit_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_facilities" ADD CONSTRAINT "temple_facilities_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_news" ADD CONSTRAINT "temple_news_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_officials" ADD CONSTRAINT "temple_officials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_officials" ADD CONSTRAINT "temple_officials_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pilgrimages" ADD CONSTRAINT "user_pilgrimages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pilgrimages" ADD CONSTRAINT "user_pilgrimages_route_id_pilgrimage_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."pilgrimage_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_histories" ADD CONSTRAINT "visit_histories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_histories" ADD CONSTRAINT "visit_histories_temple_id_temples_id_fk" FOREIGN KEY ("temple_id") REFERENCES "public"."temples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_photos" ADD CONSTRAINT "visit_photos_visit_history_id_visit_histories_id_fk" FOREIGN KEY ("visit_history_id") REFERENCES "public"."visit_histories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = '運営'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';
--> statement-breakpoint
CREATE OR REPLACE FUNCTION is_temple_official(target_temple_id int) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.temple_officials
    WHERE user_id = auth.uid()
      AND temple_id = target_temple_id
      AND status = '承認済'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = '';
--> statement-breakpoint
CREATE POLICY "badges_select_public" ON "badges" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "badges_admin_all" ON "badges" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "bookmarks_select_public" ON "bookmarks" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "bookmarks_insert_own" ON "bookmarks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "bookmarks_delete_own" ON "bookmarks" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "bookmarks_admin_all" ON "bookmarks" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "comments_select_public" ON "comments" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "comments_insert_own" ON "comments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "comments_update_own" ON "comments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "comments_delete_own" ON "comments" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "comments_admin_all" ON "comments" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "follows_select_public" ON "follows" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "follows_insert_own" ON "follows" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (follower_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "follows_delete_own" ON "follows" AS PERMISSIVE FOR DELETE TO "authenticated" USING (follower_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "follows_admin_all" ON "follows" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "likes_select_public" ON "likes" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "likes_insert_own" ON "likes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "likes_delete_own" ON "likes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "likes_admin_all" ON "likes" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "pilgrimage_impressions_select_public" ON "pilgrimage_impressions" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "pilgrimage_impressions_insert_own" ON "pilgrimage_impressions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "pilgrimage_impressions_update_own" ON "pilgrimage_impressions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "pilgrimage_impressions_delete_own" ON "pilgrimage_impressions" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "pilgrimage_impressions_admin_all" ON "pilgrimage_impressions" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "pilgrimage_routes_select_public" ON "pilgrimage_routes" AS PERMISSIVE FOR SELECT TO public USING (is_public = true);--> statement-breakpoint
CREATE POLICY "pilgrimage_routes_select_own" ON "pilgrimage_routes" AS PERMISSIVE FOR SELECT TO "authenticated" USING (creator_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "pilgrimage_routes_insert_own" ON "pilgrimage_routes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (creator_id = (select auth.uid()) AND type = 'ユーザー');--> statement-breakpoint
CREATE POLICY "pilgrimage_routes_update_own" ON "pilgrimage_routes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (creator_id = (select auth.uid())) WITH CHECK (creator_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "pilgrimage_routes_delete_own" ON "pilgrimage_routes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (creator_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "pilgrimage_routes_admin_all" ON "pilgrimage_routes" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "reports_select_own" ON "reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING (reporter_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "reports_insert_own" ON "reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (reporter_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "reports_admin_all" ON "reports" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "route_temples_select_public" ON "route_temples" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND is_public = true));--> statement-breakpoint
CREATE POLICY "route_temples_select_own" ON "route_temples" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "route_temples_insert_own" ON "route_temples" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "route_temples_update_own" ON "route_temples" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "route_temples_delete_own" ON "route_temples" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "route_temples_admin_all" ON "route_temples" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "temple_aliases_select_public" ON "temple_aliases" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "temple_aliases_insert_official" ON "temple_aliases" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_aliases_update_official" ON "temple_aliases" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (is_temple_official(temple_id)) WITH CHECK (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_aliases_delete_official" ON "temple_aliases" AS PERMISSIVE FOR DELETE TO "authenticated" USING (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_aliases_admin_all" ON "temple_aliases" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "temple_edit_requests_select_requester" ON "temple_edit_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING (requester_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "temple_edit_requests_select_official" ON "temple_edit_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_edit_requests_insert_own" ON "temple_edit_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (requester_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "temple_edit_requests_update_official" ON "temple_edit_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (is_temple_official(temple_id)) WITH CHECK (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_edit_requests_delete_own" ON "temple_edit_requests" AS PERMISSIVE FOR DELETE TO "authenticated" USING (requester_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "temple_edit_requests_admin_all" ON "temple_edit_requests" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "temple_facilities_select_public" ON "temple_facilities" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "temple_facilities_insert_official" ON "temple_facilities" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_facilities_update_official" ON "temple_facilities" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (is_temple_official(temple_id)) WITH CHECK (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_facilities_delete_official" ON "temple_facilities" AS PERMISSIVE FOR DELETE TO "authenticated" USING (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_facilities_admin_all" ON "temple_facilities" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "temple_news_select_public" ON "temple_news" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "temple_news_insert_official" ON "temple_news" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_news_update_official" ON "temple_news" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (is_temple_official(temple_id)) WITH CHECK (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_news_delete_official" ON "temple_news" AS PERMISSIVE FOR DELETE TO "authenticated" USING (is_temple_official(temple_id));--> statement-breakpoint
CREATE POLICY "temple_news_admin_all" ON "temple_news" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "temple_officials_select_own" ON "temple_officials" AS PERMISSIVE FOR SELECT TO "authenticated" USING (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "temple_officials_insert_own" ON "temple_officials" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "temple_officials_update_pending" ON "temple_officials" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = (select auth.uid()) AND status = '申請中') WITH CHECK (user_id = (select auth.uid()) AND status = '申請中');--> statement-breakpoint
CREATE POLICY "temple_officials_admin_all" ON "temple_officials" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "temples_select_public" ON "temples" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "temples_update_official" ON "temples" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (is_temple_official(id)) WITH CHECK (is_temple_official(id));--> statement-breakpoint
CREATE POLICY "temples_admin_all" ON "temples" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "user_badges_select_public" ON "user_badges" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "user_badges_admin_all" ON "user_badges" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "user_pilgrimages_select_public" ON "user_pilgrimages" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "user_pilgrimages_insert_own" ON "user_pilgrimages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_pilgrimages_update_own" ON "user_pilgrimages" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_pilgrimages_delete_own" ON "user_pilgrimages" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_pilgrimages_admin_all" ON "user_pilgrimages" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "users_select_public" ON "users" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "users_insert_self" ON "users" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "users_update_self" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (id = (select auth.uid())) WITH CHECK (id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "users_admin_all" ON "users" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "visit_histories_select_public" ON "visit_histories" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "visit_histories_insert_own" ON "visit_histories" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "visit_histories_update_own" ON "visit_histories" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "visit_histories_delete_own" ON "visit_histories" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "visit_histories_admin_all" ON "visit_histories" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());--> statement-breakpoint
CREATE POLICY "visit_photos_select_public" ON "visit_photos" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "visit_photos_insert_own" ON "visit_photos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "visit_photos_update_own" ON "visit_photos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "visit_photos_delete_own" ON "visit_photos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "visit_photos_admin_all" ON "visit_photos" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_admin()) WITH CHECK (is_admin());