-- CreateTable
CREATE TABLE "grade" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "userSubjectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_userSubjectId_fkey" FOREIGN KEY ("userSubjectId") REFERENCES "user_subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
