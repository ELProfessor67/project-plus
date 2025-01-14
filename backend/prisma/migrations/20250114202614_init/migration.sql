/*
  Warnings:

  - You are about to drop the column `connect_mail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `connect_mail_password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "connect_mail",
DROP COLUMN "connect_mail_password",
ADD COLUMN     "connect_mail_hash" TEXT;
