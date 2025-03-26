-- CreateTable
CREATE TABLE "Documents" (
    "document_id" TEXT NOT NULL,
    "project_client_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER,
    "mimeType" TEXT,
    "filename" TEXT,
    "key" TEXT,
    "description" TEXT,
    "appproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "Updates" (
    "update_id" TEXT NOT NULL,
    "project_client_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER,
    "mimeType" TEXT,
    "filename" TEXT,
    "file_url" TEXT,

    CONSTRAINT "Updates_pkey" PRIMARY KEY ("update_id")
);

-- CreateTable
CREATE TABLE "Billing" (
    "billing_id" TEXT NOT NULL,
    "project_client_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("billing_id")
);

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_project_client_id_fkey" FOREIGN KEY ("project_client_id") REFERENCES "ProjectClient"("project_client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_project_client_id_fkey" FOREIGN KEY ("project_client_id") REFERENCES "ProjectClient"("project_client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_project_client_id_fkey" FOREIGN KEY ("project_client_id") REFERENCES "ProjectClient"("project_client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
