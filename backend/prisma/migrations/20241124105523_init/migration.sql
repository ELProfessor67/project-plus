-- CreateEnum
CREATE TYPE "Priorities" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "last_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "priority" "Priorities" NOT NULL DEFAULT 'NONE';
