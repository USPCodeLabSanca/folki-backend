-- AlterTable
ALTER TABLE "campus" ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "group" ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "important_date" ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "institute" ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "subject" ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "subject_class" ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "universityId" INTEGER;

-- CreateTable
CREATE TABLE "university" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "university_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_name_key" ON "university"("name");

-- AddForeignKey
ALTER TABLE "campus" ADD CONSTRAINT "campus_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute" ADD CONSTRAINT "institute_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_class" ADD CONSTRAINT "subject_class_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "important_date" ADD CONSTRAINT "important_date_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "university"("id") ON DELETE SET NULL ON UPDATE CASCADE;
