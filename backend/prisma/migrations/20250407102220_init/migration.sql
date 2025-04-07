/*
  Warnings:

  - You are about to drop the column `staus` on the `signed` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "signed" DROP COLUMN "staus",
ADD COLUMN     "status" "signedStatus" NOT NULL DEFAULT 'PENDING';
