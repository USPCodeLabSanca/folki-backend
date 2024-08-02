-- CreateTable
CREATE TABLE "user_activity_check" (
    "userId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_check_pkey" PRIMARY KEY ("userId","activityId")
);

-- AddForeignKey
ALTER TABLE "user_activity_check" ADD CONSTRAINT "user_activity_check_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_check" ADD CONSTRAINT "user_activity_check_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
