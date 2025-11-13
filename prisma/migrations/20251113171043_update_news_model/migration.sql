-- AlterTable
ALTER TABLE "Career" ADD COLUMN     "career_benefits" JSONB,
ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "education_requirement" TEXT,
ADD COLUMN     "salary_range" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "work_environment" TEXT;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "author" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read_time" INTEGER,
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "views_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "is_published" SET DEFAULT true;

-- CreateIndex
CREATE INDEX "Career_sort_order_idx" ON "Career"("sort_order");

-- CreateIndex
CREATE INDEX "News_category_idx" ON "News"("category");

-- CreateIndex
CREATE INDEX "News_featured_idx" ON "News"("featured");

-- CreateIndex
CREATE INDEX "News_sort_order_idx" ON "News"("sort_order");
