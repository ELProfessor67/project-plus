-- CreateEnum
CREATE TYPE "signedStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "signed" ADD COLUMN     "staus" "signedStatus" NOT NULL DEFAULT 'PENDING';
