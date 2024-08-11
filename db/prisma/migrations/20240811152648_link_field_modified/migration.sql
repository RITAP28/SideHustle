-- DropIndex
DROP INDEX "Projects_projectLink_key";

-- AlterTable
ALTER TABLE "Projects" ALTER COLUMN "projectLink" DROP NOT NULL,
ALTER COLUMN "projectLink" SET DEFAULT 'value';
