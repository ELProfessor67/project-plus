-- CreateTable
CREATE TABLE "UserTeam" (
    "team_member_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "leader_id" INTEGER NOT NULL,

    CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("team_member_id")
);

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
