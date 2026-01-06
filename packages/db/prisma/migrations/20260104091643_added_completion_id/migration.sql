/*
  Warnings:

  - Added the required column `completedBy` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "completed" "ContestStatus" NOT NULL DEFAULT 'NotCompleted',
ADD COLUMN     "completedBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
