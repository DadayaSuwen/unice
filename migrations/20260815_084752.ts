import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "careers" ALTER COLUMN "description" SET DATA TYPE jsonb USING NULL::jsonb;
  ALTER TABLE "careers" ALTER COLUMN "work_environment" SET DATA TYPE jsonb USING NULL::jsonb;
  ALTER TABLE "careers" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "careers" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "careers" ADD COLUMN "seo_keywords" varchar;
  ALTER TABLE "careers" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "careers" ADD COLUMN "seo_canonical" varchar;
  ALTER TABLE "careers" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "careers" ADD CONSTRAINT "careers_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "careers_seo_seo_og_image_idx" ON "careers" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "careers" DROP CONSTRAINT "careers_seo_og_image_id_media_id_fk";
  
  DROP INDEX "careers_seo_seo_og_image_idx";
  ALTER TABLE "careers" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "careers" ALTER COLUMN "work_environment" SET DATA TYPE varchar;
  ALTER TABLE "careers" DROP COLUMN "seo_meta_title";
  ALTER TABLE "careers" DROP COLUMN "seo_meta_description";
  ALTER TABLE "careers" DROP COLUMN "seo_keywords";
  ALTER TABLE "careers" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "careers" DROP COLUMN "seo_canonical";
  ALTER TABLE "careers" DROP COLUMN "seo_noindex";`)
}
