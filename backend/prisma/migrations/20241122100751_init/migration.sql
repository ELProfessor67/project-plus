/*
  Warnings:

  - Added the required column `account_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bring` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hear_about_as` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teams_member_count` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "account_name" TEXT NOT NULL,
ADD COLUMN     "bring" TEXT NOT NULL,
ADD COLUMN     "focus" TEXT[],
ADD COLUMN     "hear_about_as" TEXT NOT NULL,
ADD COLUMN     "teams_member_count" TEXT NOT NULL;
