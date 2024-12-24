-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('PENDING', 'SCHEDULED', 'CANCELED', 'COMPLETED', 'PROCESSING');

-- CreateTable
CREATE TABLE "Meeting" (
    "meeting_id" TEXT NOT NULL,
    "task_id" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "desciption" TEXT NOT NULL,
    "isScheduled" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3),
    "time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "status" "MeetingStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("meeting_id")
);

-- CreateTable
CREATE TABLE "MeetingParticipant" (
    "meeting_participant_id" TEXT NOT NULL,
    "meeting_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "MeetingParticipant_pkey" PRIMARY KEY ("meeting_participant_id")
);

-- CreateTable
CREATE TABLE "MeetingTranscibtion" (
    "meeting_transcribtion_id" TEXT NOT NULL,
    "meeting_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "MeetingTranscibtion_pkey" PRIMARY KEY ("meeting_transcribtion_id")
);

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "Meeting"("meeting_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingTranscibtion" ADD CONSTRAINT "MeetingTranscibtion_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "Meeting"("meeting_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingTranscibtion" ADD CONSTRAINT "MeetingTranscibtion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
