-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "duration" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "end_time" TIMESTAMP(3),
ADD COLUMN     "start_time" TIMESTAMP(3);
