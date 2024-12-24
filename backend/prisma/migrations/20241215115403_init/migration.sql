/*
  Warnings:

  - Added the required column `transcribe` to the `MeetingTranscibtion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingTranscibtion" ADD COLUMN     "transcribe" TEXT NOT NULL;
