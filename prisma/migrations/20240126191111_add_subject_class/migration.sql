-- CreateTable
CREATE TABLE "subject_class" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "professorName" TEXT NOT NULL,
    "availableDays" JSONB NOT NULL,

    CONSTRAINT "subject_class_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subject_class" ADD CONSTRAINT "subject_class_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
