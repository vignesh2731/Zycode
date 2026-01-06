/*
  Warnings:

  - Added the required column `problemNumber` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_completedBy_fkey";

-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "winner" INTEGER;

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "problemNumber" INTEGER NOT NULL,
ALTER COLUMN "completedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_winner_fkey" FOREIGN KEY ("winner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
