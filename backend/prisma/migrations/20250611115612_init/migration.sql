-- CreateEnum
CREATE TYPE "FileTypes" AS ENUM ('FILE', 'FOLDER');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "file_type" "FileTypes" NOT NULL DEFAULT 'FILE';

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "file_type" "FileTypes" NOT NULL DEFAULT 'FOLDER';
