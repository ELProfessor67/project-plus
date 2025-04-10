-- CreateEnum
CREATE TYPE "ProgressTypes" AS ENUM ('MAIL', 'MEETING', 'CHAT', 'CALL', 'COMMENT', 'TRANSCRIBTION', 'STATUS_CHANGED', 'OTHER');

-- AlterTable
ALTER TABLE "TaskProgress" ADD COLUMN     "type" "ProgressTypes" NOT NULL DEFAULT 'OTHER';
