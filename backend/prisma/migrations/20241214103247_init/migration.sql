-- CreateEnum
CREATE TYPE "Vote" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- AlterTable
ALTER TABLE "MeetingParticipant" ADD COLUMN     "vote" "Vote" DEFAULT 'PENDING';
