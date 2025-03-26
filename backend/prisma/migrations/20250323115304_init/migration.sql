/*
  Warnings:

  - You are about to drop the column `appproved` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Documents` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "appproved",
DROP COLUMN "key",
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "file_url" DROP NOT NULL;
