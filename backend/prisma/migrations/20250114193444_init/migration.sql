/*
  Warnings:

  - You are about to drop the column `mail_access_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "mail_access_token",
ADD COLUMN     "connect_mail" TEXT,
ADD COLUMN     "connect_mail_password" TEXT;
