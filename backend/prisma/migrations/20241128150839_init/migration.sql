-- CreateTable
CREATE TABLE "Transcibtion" (
    "transcribtion_id" TEXT NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "Transcibtion" TEXT NOT NULL,

    CONSTRAINT "Transcibtion_pkey" PRIMARY KEY ("transcribtion_id")
);

-- AddForeignKey
ALTER TABLE "Transcibtion" ADD CONSTRAINT "Transcibtion_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcibtion" ADD CONSTRAINT "Transcibtion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
