-- CreateTable
CREATE TABLE "user_absence" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "subjectId" INTEGER,

    CONSTRAINT "user_absence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_absence" ADD CONSTRAINT "user_absence_userId_subjectId_fkey" FOREIGN KEY ("userId", "subjectId") REFERENCES "user_subject"("userId", "subjectId") ON DELETE SET NULL ON UPDATE CASCADE;
