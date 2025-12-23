-- AlterEnum
ALTER TYPE "ProjectType" ADD VALUE 'picture';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "name" TEXT;
