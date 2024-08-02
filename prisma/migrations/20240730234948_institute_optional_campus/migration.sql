-- DropForeignKey
ALTER TABLE "institute" DROP CONSTRAINT "institute_campusId_fkey";

-- AlterTable
ALTER TABLE "institute" ALTER COLUMN "campusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "institute" ADD CONSTRAINT "institute_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
