-- CreateIndex
CREATE INDEX "Contest_createdAt_idx" ON "Contest"("createdAt");

-- CreateIndex
CREATE INDEX "Contest_winner_idx" ON "Contest"("winner");

-- CreateIndex
CREATE INDEX "Contest_isCompleted_idx" ON "Contest"("isCompleted");

-- CreateIndex
CREATE INDEX "Contest_createdBy_idx" ON "Contest"("createdBy");

-- CreateIndex
CREATE INDEX "Problem_contestId_idx" ON "Problem"("contestId");

-- CreateIndex
CREATE INDEX "Problem_completed_idx" ON "Problem"("completed");

-- CreateIndex
CREATE INDEX "Problem_completedBy_idx" ON "Problem"("completedBy");

-- CreateIndex
CREATE INDEX "Problem_contestId_problemNumber_idx" ON "Problem"("contestId", "problemNumber");

-- CreateIndex
CREATE INDEX "TestCase_problemId_idx" ON "TestCase"("problemId");

-- CreateIndex
CREATE INDEX "TestCase_problemId_order_idx" ON "TestCase"("problemId", "order");
