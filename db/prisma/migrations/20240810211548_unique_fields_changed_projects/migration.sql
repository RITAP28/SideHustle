/*
  Warnings:

  - A unique constraint covering the columns `[projectName,userId]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Projects_projectId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectName_userId_key" ON "Projects"("projectName", "userId");
