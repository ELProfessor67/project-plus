-- AlterTable
ALTER TABLE "TaskTime" ADD COLUMN     "project_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "TaskTime" ADD CONSTRAINT "TaskTime_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;
