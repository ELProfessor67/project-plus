-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;
