-- CreateEnum
CREATE TYPE "TimeStatus" AS ENUM ('PROCESSING', 'ENDED');

-- CreateTable
CREATE TABLE "TaskTime" (
    "time_id" TEXT NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "status" "TimeStatus" NOT NULL DEFAULT 'PROCESSING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskTime_pkey" PRIMARY KEY ("time_id")
);

-- AddForeignKey
ALTER TABLE "TaskTime" ADD CONSTRAINT "TaskTime_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTime" ADD CONSTRAINT "TaskTime_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
