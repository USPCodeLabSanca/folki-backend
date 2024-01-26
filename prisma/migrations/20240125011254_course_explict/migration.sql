/*
  Warnings:

  - You are about to drop the `_courseToinstitute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_courseToinstitute" DROP CONSTRAINT "_courseToinstitute_A_fkey";

-- DropForeignKey
ALTER TABLE "_courseToinstitute" DROP CONSTRAINT "_courseToinstitute_B_fkey";

-- DropTable
DROP TABLE "_courseToinstitute";

-- CreateTable
CREATE TABLE "institute_course" (
    "instituteId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "institute_course_pkey" PRIMARY KEY ("instituteId","courseId")
);

-- AddForeignKey
ALTER TABLE "institute_course" ADD CONSTRAINT "institute_course_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_course" ADD CONSTRAINT "institute_course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
