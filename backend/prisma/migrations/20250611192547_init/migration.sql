/*
  Warnings:

  - You are about to drop the column `project_id` on the `TemplateDocument` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `TemplateDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leader_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'TEAM';

-- DropForeignKey
ALTER TABLE "TemplateDocument" DROP CONSTRAINT "TemplateDocument_project_id_fkey";

-- AlterTable
ALTER TABLE "TemplateDocument" DROP COLUMN "project_id",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "leader_id" INTEGER NOT NULL;
