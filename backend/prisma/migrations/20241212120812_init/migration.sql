/*
  Warnings:

  - You are about to drop the column `desciption` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `description` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT NOT NULL;
