import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "news" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "news" ADD COLUMN "seo_keywords" varchar;
  ALTER TABLE "news" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "news" ADD COLUMN "seo_canonical" varchar;
  ALTER TABLE "news" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "news" ADD CONSTRAINT "news_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "news_seo_seo_og_image_idx" ON "news" USING btree ("seo_og_image_id");
  ALTER TABLE "news" DROP COLUMN "seo_title";
  ALTER TABLE "news" DROP COLUMN "seo_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" DROP CONSTRAINT "news_seo_og_image_id_media_id_fk";
  
  DROP INDEX "news_seo_seo_og_image_idx";
  ALTER TABLE "news" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "news" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "news" DROP COLUMN "seo_meta_title";
  ALTER TABLE "news" DROP COLUMN "seo_meta_description";
  ALTER TABLE "news" DROP COLUMN "seo_keywords";
  ALTER TABLE "news" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "news" DROP COLUMN "seo_canonical";
  ALTER TABLE "news" DROP COLUMN "seo_noindex";`)
}
