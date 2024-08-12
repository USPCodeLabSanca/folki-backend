-- AlterTable
ALTER TABLE "important_date" ADD COLUMN     "campusId" INTEGER;

-- AddForeignKey
ALTER TABLE "important_date" ADD CONSTRAINT "important_date_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
