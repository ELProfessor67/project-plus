-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bring" DROP NOT NULL,
ALTER COLUMN "bring" SET DEFAULT 'null',
ALTER COLUMN "hear_about_as" DROP NOT NULL,
ALTER COLUMN "hear_about_as" SET DEFAULT 'null',
ALTER COLUMN "teams_member_count" DROP NOT NULL,
ALTER COLUMN "teams_member_count" SET DEFAULT 'null';
