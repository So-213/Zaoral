/*
  Warnings:

  - You are about to drop the column `file_name` on the `projects_picture` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `projects_picture` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `projects_picture` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded_at` on the `projects_picture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects_picture" DROP COLUMN "file_name",
DROP COLUMN "file_size",
DROP COLUMN "mime_type",
DROP COLUMN "uploaded_at";
