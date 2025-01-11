-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('RINGING', 'PROCESSING', 'REJECTED', 'ENDED');

-- AlterEnum
ALTER TYPE "ContentType" ADD VALUE 'CALL';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "call_status" "CallStatus" NOT NULL DEFAULT 'RINGING',
ADD COLUMN     "duration" TEXT DEFAULT '1min';
