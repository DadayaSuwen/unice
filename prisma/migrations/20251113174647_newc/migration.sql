/*
  Warnings:

  - You are about to drop the column `category` on the `News` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "News_category_idx";

-- AlterTable
ALTER TABLE "News" DROP COLUMN "category",
ADD COLUMN     "category_id" INTEGER;

-- CreateTable
CREATE TABLE "NewsCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsCategory_name_key" ON "NewsCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NewsCategory_slug_key" ON "NewsCategory"("slug");

-- CreateIndex
CREATE INDEX "NewsCategory_slug_idx" ON "NewsCategory"("slug");

-- CreateIndex
CREATE INDEX "NewsCategory_is_active_idx" ON "NewsCategory"("is_active");

-- CreateIndex
CREATE INDEX "NewsCategory_sort_order_idx" ON "NewsCategory"("sort_order");

-- CreateIndex
CREATE INDEX "News_category_id_idx" ON "News"("category_id");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "NewsCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
