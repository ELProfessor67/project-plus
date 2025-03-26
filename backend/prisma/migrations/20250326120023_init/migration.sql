/*
  Warnings:

  - Added the required column `end_date` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Billing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PAID', 'UNPAID');

-- AlterTable
ALTER TABLE "Billing" ADD COLUMN     "end_date" TEXT NOT NULL,
ADD COLUMN     "start_date" TEXT NOT NULL,
ADD COLUMN     "status" "BillingStatus" NOT NULL DEFAULT 'UNPAID';
