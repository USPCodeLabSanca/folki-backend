-- CreateTable
CREATE TABLE "user_activity_ignore" (
    "userId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_ignore_pkey" PRIMARY KEY ("userId","activityId")
);

-- CreateIndex
CREATE INDEX "user_activity_ignore_userId_activityId_idx" ON "user_activity_ignore"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "user_activity_ignore" ADD CONSTRAINT "user_activity_ignore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_ignore" ADD CONSTRAINT "user_activity_ignore_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
