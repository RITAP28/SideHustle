/*
  Warnings:

  - A unique constraint covering the columns `[projectName,userId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_projectId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectName_userId_key" ON "Project"("projectName", "userId");
