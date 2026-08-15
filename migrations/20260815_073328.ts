import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_milestones_color" AS ENUM('gold', 'secondary', 'accent');
  CREATE TYPE "public"."enum_about_page_rd_cards_icon" AS ENUM('check', 'bolt', 'shield', 'globe', 'team', 'spark', 'flask', 'factory');
  CREATE TYPE "public"."enum_home_page_features_features_icon" AS ENUM('check', 'bolt', 'shield', 'globe', 'team', 'spark', 'flask', 'factory', 'target', 'layers');

  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT '江西联合化工',
  	"site_tagline" varchar DEFAULT '专业树脂制造商',
  	"logo_id" integer,
  	"footer_description" varchar,
  	"quality_mark" varchar DEFAULT 'ISO 9001',
  	"quality_desc" varchar DEFAULT '质量认证企业',
  	"icp_number" varchar,
  	"copyright_text" varchar,
  	"contact_address" varchar,
  	"contact_address_line2" varchar,
  	"contact_zip_code" varchar,
  	"contact_phone" varchar,
  	"contact_fax" varchar,
  	"contact_email" varchar,
  	"contact_tech_phone" varchar,
  	"head_scripts" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );

  CREATE TABLE "site_settings_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );

  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"is_active" boolean DEFAULT true
  );

  CREATE TABLE "page_headers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"products_page_enabled" boolean DEFAULT true,
  	"products_page_title" varchar,
  	"products_page_subtitle" varchar,
  	"news_page_enabled" boolean DEFAULT true,
  	"news_page_title" varchar,
  	"news_page_subtitle" varchar,
  	"careers_page_enabled" boolean DEFAULT true,
  	"careers_page_title" varchar,
  	"careers_page_subtitle" varchar,
  	"contact_page_enabled" boolean DEFAULT true,
  	"contact_page_title" varchar,
  	"contact_page_subtitle" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_enabled" boolean DEFAULT true,
  	"hero_title" varchar,
  	"hero_subtitle_line1" varchar,
  	"hero_subtitle_line2" varchar,
  	"hero_bg_image_id" integer,
  	"hero_bg_image_url" varchar,
  	"hero_primary_button_text" varchar,
  	"hero_primary_button_href" varchar,
  	"hero_secondary_button_text" varchar,
  	"hero_secondary_button_href" varchar,
  	"hero_scroll_text" varchar,
  	"showcase_enabled" boolean DEFAULT true,
  	"showcase_title" varchar,
  	"showcase_subtitle" varchar,
  	"showcase_cta_text" varchar,
  	"showcase_cta_href" varchar DEFAULT '/products',
  	"features_enabled" boolean DEFAULT true,
  	"features_title" varchar,
  	"features_subtitle" varchar,
  	"factory_enabled" boolean DEFAULT true,
  	"factory_title" varchar,
  	"factory_subtitle" varchar,
  	"factory_image_id" integer,
  	"factory_image_url" varchar,
  	"factory_overlay_title" varchar,
  	"factory_overlay_text" varchar,
  	"stats_enabled" boolean DEFAULT true,
  	"stats_title" varchar,
  	"stats_subtitle" varchar,
  	"cta_enabled" boolean DEFAULT true,
  	"cta_title" varchar,
  	"cta_subtitle" varchar,
  	"cta_primary_button_text" varchar,
  	"cta_primary_button_href" varchar,
  	"cta_secondary_button_text" varchar,
  	"cta_secondary_button_href" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "home_page_showcase_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"href" varchar DEFAULT '/products'
  );

  CREATE TABLE "home_page_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "public"."enum_home_page_features_features_icon",
  	"title" varchar,
  	"description" varchar
  );

  CREATE TABLE "home_page_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar
  );

  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"intro_group_intro_title" varchar,
  	"intro_group_intro_content" jsonb,
  	"intro_group_intro_image_id" integer,
  	"mission_title" varchar DEFAULT '公司使命',
  	"vision_title" varchar DEFAULT '公司愿景',
  	"mission_description" varchar,
  	"vision_description" varchar,
  	"rd_title" varchar DEFAULT '研发与技术',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "about_page_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar,
  	"badge" varchar,
  	"color" "public"."enum_about_page_milestones_color" DEFAULT 'gold'
  );

  CREATE TABLE "about_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar
  );

  CREATE TABLE "about_page_rd_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "public"."enum_about_page_rd_cards_icon",
  	"title" varchar,
  	"description" varchar
  );

  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_legal_links" ADD CONSTRAINT "site_settings_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_headers" ADD CONSTRAINT "page_headers_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_factory_image_id_media_id_fk" FOREIGN KEY ("factory_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_bg_image_id_media_id_fk" FOREIGN KEY ("hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_showcase_cards" ADD CONSTRAINT "home_page_showcase_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_showcase_cards" ADD CONSTRAINT "home_page_showcase_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_features_features" ADD CONSTRAINT "home_page_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stats_stats" ADD CONSTRAINT "home_page_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_intro_group_intro_image_id_media_id_fk" FOREIGN KEY ("intro_group_intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_milestones" ADD CONSTRAINT "about_page_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_stats" ADD CONSTRAINT "about_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_rd_cards" ADD CONSTRAINT "about_page_rd_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_legal_links_order_idx" ON "site_settings_legal_links" USING btree ("_order");
  CREATE INDEX "site_settings_legal_links_parent_id_idx" ON "site_settings_legal_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE INDEX "page_headers_seo_seo_og_image_idx" ON "page_headers" USING btree ("seo_og_image_id");
  CREATE INDEX "home_page_factory_factory_image_idx" ON "home_page" USING btree ("factory_image_id");
  CREATE INDEX "home_page_hero_hero_bg_image_idx" ON "home_page" USING btree ("hero_bg_image_id");
  CREATE INDEX "home_page_seo_seo_og_image_idx" ON "home_page" USING btree ("seo_og_image_id");
  CREATE INDEX "home_page_showcase_cards_image_idx" ON "home_page_showcase_cards" USING btree ("image_id");
  CREATE INDEX "home_page_showcase_cards_order_idx" ON "home_page_showcase_cards" USING btree ("_order");
  CREATE INDEX "home_page_showcase_cards_parent_id_idx" ON "home_page_showcase_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_features_features_order_idx" ON "home_page_features_features" USING btree ("_order");
  CREATE INDEX "home_page_features_features_parent_id_idx" ON "home_page_features_features" USING btree ("_parent_id");
  CREATE INDEX "home_page_stats_stats_order_idx" ON "home_page_stats_stats" USING btree ("_order");
  CREATE INDEX "home_page_stats_stats_parent_id_idx" ON "home_page_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_intro_group_intro_group_intro_image_idx" ON "about_page" USING btree ("intro_group_intro_image_id");
  CREATE INDEX "about_page_seo_seo_og_image_idx" ON "about_page" USING btree ("seo_og_image_id");
  CREATE INDEX "about_page_milestones_order_idx" ON "about_page_milestones" USING btree ("_order");
  CREATE INDEX "about_page_milestones_parent_id_idx" ON "about_page_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_page_stats_order_idx" ON "about_page_stats" USING btree ("_order");
  CREATE INDEX "about_page_stats_parent_id_idx" ON "about_page_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_rd_cards_order_idx" ON "about_page_rd_cards" USING btree ("_order");
  CREATE INDEX "about_page_rd_cards_parent_id_idx" ON "about_page_rd_cards" USING btree ("_parent_id");

  CREATE TABLE "products_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar
  );

  CREATE TABLE "products_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );

  CREATE TABLE "products_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );

  CREATE TABLE "products_safety_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar
  );

  ALTER TABLE "products" ALTER COLUMN "description" SET DATA TYPE jsonb USING NULL::jsonb;
  ALTER TABLE "products" ADD COLUMN "summary" varchar;
  ALTER TABLE "products" ADD COLUMN "image_id" integer;
  ALTER TABLE "products" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "products" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "products" ADD COLUMN "seo_keywords" varchar;
  ALTER TABLE "products" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "products" ADD COLUMN "seo_canonical" varchar;
  ALTER TABLE "products" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "products_details" ADD CONSTRAINT "products_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_features" ADD CONSTRAINT "products_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_applications" ADD CONSTRAINT "products_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_safety_info" ADD CONSTRAINT "products_safety_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_details_order_idx" ON "products_details" USING btree ("_order");
  CREATE INDEX "products_details_parent_id_idx" ON "products_details" USING btree ("_parent_id");
  CREATE INDEX "products_features_order_idx" ON "products_features" USING btree ("_order");
  CREATE INDEX "products_features_parent_id_idx" ON "products_features" USING btree ("_parent_id");
  CREATE INDEX "products_applications_order_idx" ON "products_applications" USING btree ("_order");
  CREATE INDEX "products_applications_parent_id_idx" ON "products_applications" USING btree ("_parent_id");
  CREATE INDEX "products_safety_info_order_idx" ON "products_safety_info" USING btree ("_order");
  CREATE INDEX "products_safety_info_parent_id_idx" ON "products_safety_info" USING btree ("_parent_id");
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_seo_seo_og_image_idx" ON "products" USING btree ("seo_og_image_id");
  ALTER TABLE "products" DROP COLUMN "details";
  ALTER TABLE "products" DROP COLUMN "features";
  ALTER TABLE "products" DROP COLUMN "applications";
  ALTER TABLE "products" DROP COLUMN "safety_info";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP CONSTRAINT "products_image_id_media_id_fk";

  ALTER TABLE "products" DROP CONSTRAINT "products_seo_og_image_id_media_id_fk";

  DROP INDEX "products_image_idx";
  DROP INDEX "products_seo_seo_og_image_idx";
  ALTER TABLE "products" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "products" ADD COLUMN "details" jsonb;
  ALTER TABLE "products" ADD COLUMN "features" jsonb;
  ALTER TABLE "products" ADD COLUMN "applications" jsonb;
  ALTER TABLE "products" ADD COLUMN "safety_info" jsonb;
  ALTER TABLE "products" DROP COLUMN "summary";
  ALTER TABLE "products" DROP COLUMN "image_id";
  ALTER TABLE "products" DROP COLUMN "seo_meta_title";
  ALTER TABLE "products" DROP COLUMN "seo_meta_description";
  ALTER TABLE "products" DROP COLUMN "seo_keywords";
  ALTER TABLE "products" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "products" DROP COLUMN "seo_canonical";
  ALTER TABLE "products" DROP COLUMN "seo_noindex";
  DROP TABLE "products_details" CASCADE;
  DROP TABLE "products_features" CASCADE;
  DROP TABLE "products_applications" CASCADE;
  DROP TABLE "products_safety_info" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings_legal_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "page_headers" CASCADE;
  DROP TABLE "home_page_showcase_cards" CASCADE;
  DROP TABLE "home_page_features_features" CASCADE;
  DROP TABLE "home_page_stats_stats" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page_milestones" CASCADE;
  DROP TABLE "about_page_stats" CASCADE;
  DROP TABLE "about_page_rd_cards" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TYPE "public"."enum_about_page_milestones_color";
  DROP TYPE "public"."enum_about_page_rd_cards_icon";
  DROP TYPE "public"."enum_home_page_features_features_icon";`)
}
