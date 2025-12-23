-- CreateTable
CREATE TABLE "projects_picture" (
    "project_id" TEXT NOT NULL,
    "s3_key" TEXT NOT NULL,
    "file_name" TEXT,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_picture_pkey" PRIMARY KEY ("project_id")
);

-- AddForeignKey
ALTER TABLE "projects_picture" ADD CONSTRAINT "projects_picture_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
