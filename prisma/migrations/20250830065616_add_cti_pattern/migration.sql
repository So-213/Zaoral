/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "public"."ProjectType" AS ENUM ('message');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_user_id_fkey";

-- DropTable
DROP TABLE "public"."Project";

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "type" "public"."ProjectType" NOT NULL,
    "slug" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects_message" (
    "project_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "projects_message_pkey" PRIMARY KEY ("project_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "public"."projects"("slug");

-- CreateIndex
CREATE INDEX "idx_projects_user_created" ON "public"."projects"("user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects_message" ADD CONSTRAINT "projects_message_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
