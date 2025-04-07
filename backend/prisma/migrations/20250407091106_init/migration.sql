-- CreateTable
CREATE TABLE "signed" (
    "signed_id" TEXT NOT NULL,
    "project_client_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "file_url" TEXT,
    "size" INTEGER,
    "mimeType" TEXT,
    "filename" TEXT,
    "key" TEXT,
    "sign_file_url" TEXT,
    "sign_size" INTEGER,
    "sign_mimeType" TEXT,
    "sign_filename" TEXT,
    "sign_key" TEXT,
    "sign_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signed_pkey" PRIMARY KEY ("signed_id")
);

-- AddForeignKey
ALTER TABLE "signed" ADD CONSTRAINT "signed_project_client_id_fkey" FOREIGN KEY ("project_client_id") REFERENCES "ProjectClient"("project_client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
