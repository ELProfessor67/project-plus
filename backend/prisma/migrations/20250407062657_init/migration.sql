-- CreateEnum
CREATE TYPE "FilledStatus" AS ENUM ('PENDING', 'COMPLETED', 'STUCK', 'PROCESSING', 'CANCELED');

-- CreateTable
CREATE TABLE "Filled" (
    "filled_id" TEXT NOT NULL,
    "project_client_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER,
    "mimeType" TEXT,
    "filename" TEXT,
    "description" TEXT,
    "progress" TEXT,
    "date" TIMESTAMP(3),
    "name" TEXT,
    "key" TEXT,
    "status" "FilledStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Filled_pkey" PRIMARY KEY ("filled_id")
);

-- AddForeignKey
ALTER TABLE "Filled" ADD CONSTRAINT "Filled_project_client_id_fkey" FOREIGN KEY ("project_client_id") REFERENCES "ProjectClient"("project_client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
