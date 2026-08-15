import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  DROP TABLE "products_safety_info" CASCADE;`)
}
