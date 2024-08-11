/*
  Warnings:

  - A unique constraint covering the columns `[projectLink]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectLink` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "projectLink" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectLink_key" ON "Projects"("projectLink");
