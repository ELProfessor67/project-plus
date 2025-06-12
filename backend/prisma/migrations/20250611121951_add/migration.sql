-- AlterTable
ALTER TABLE "File" ADD COLUMN     "client_id" INTEGER,
ADD COLUMN     "lawyer_id" INTEGER;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
