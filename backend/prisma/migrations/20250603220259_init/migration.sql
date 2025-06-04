/*
  Warnings:

  - You are about to drop the column `task_id` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_task_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "task_id",
ADD COLUMN     "project_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE SET NULL ON UPDATE CASCADE;
