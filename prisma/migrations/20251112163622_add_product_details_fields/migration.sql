-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "applications" JSONB,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "safety_info" JSONB;
