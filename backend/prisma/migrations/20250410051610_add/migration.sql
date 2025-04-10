/*
  Warnings:

  - You are about to drop the column `user` on the `UserTeam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserTeam" DROP COLUMN "user",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
