-- CreateTable
CREATE TABLE "group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "importanceWeight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_link" (
    "id" SERIAL NOT NULL,
    "icon" TEXT,
    "name" TEXT,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "group_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_group_campus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_group_tag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_group_campus_AB_unique" ON "_group_campus"("A", "B");

-- CreateIndex
CREATE INDEX "_group_campus_B_index" ON "_group_campus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_group_tag_AB_unique" ON "_group_tag"("A", "B");

-- CreateIndex
CREATE INDEX "_group_tag_B_index" ON "_group_tag"("B");

-- AddForeignKey
ALTER TABLE "group_link" ADD CONSTRAINT "group_link_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_campus" ADD CONSTRAINT "_group_campus_A_fkey" FOREIGN KEY ("A") REFERENCES "campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_campus" ADD CONSTRAINT "_group_campus_B_fkey" FOREIGN KEY ("B") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_tag" ADD CONSTRAINT "_group_tag_A_fkey" FOREIGN KEY ("A") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_tag" ADD CONSTRAINT "_group_tag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
