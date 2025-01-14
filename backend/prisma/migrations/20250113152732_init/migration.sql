-- CreateTable
CREATE TABLE "Call" (
    "call_sid" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("call_sid")
);

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;
