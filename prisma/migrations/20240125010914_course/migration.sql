-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_courseToinstitute" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "course_name_key" ON "course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_courseToinstitute_AB_unique" ON "_courseToinstitute"("A", "B");

-- CreateIndex
CREATE INDEX "_courseToinstitute_B_index" ON "_courseToinstitute"("B");

-- AddForeignKey
ALTER TABLE "_courseToinstitute" ADD CONSTRAINT "_courseToinstitute_A_fkey" FOREIGN KEY ("A") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseToinstitute" ADD CONSTRAINT "_courseToinstitute_B_fkey" FOREIGN KEY ("B") REFERENCES "institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
