import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_title" varchar DEFAULT '发送消息',
  	"info_title" varchar DEFAULT '联系方式',
  	"map_title" varchar DEFAULT '地理位置',
  	"map_description" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contact_page_seo_seo_og_image_idx" ON "contact_page" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contact_page" CASCADE;`)
}
