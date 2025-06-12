-- CreateTable
CREATE TABLE "TDocuments" (
    "t_document_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER,
    "mimeType" TEXT,
    "filename" TEXT,
    "description" TEXT,
    "key" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "TDocuments_pkey" PRIMARY KEY ("t_document_id")
);
