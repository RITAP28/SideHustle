-- CreateTable
CREATE TABLE "Projects" (
    "projectId" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "WebDevFile" (
    "fileId" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "folderId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,

    CONSTRAINT "WebDevFile_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "WebDevFolder" (
    "folderId" SERIAL NOT NULL,
    "folderName" TEXT NOT NULL,
    "numberOfFiles" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebDevFolder_pkey" PRIMARY KEY ("folderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectName_key" ON "Projects"("projectName");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectId_userId_key" ON "Projects"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WebDevFile_fileId_userId_key" ON "WebDevFile"("fileId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WebDevFolder_folderId_userId_key" ON "WebDevFolder"("folderId", "userId");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebDevFile" ADD CONSTRAINT "WebDevFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebDevFile" ADD CONSTRAINT "WebDevFile_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "WebDevFolder"("folderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebDevFile" ADD CONSTRAINT "WebDevFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebDevFolder" ADD CONSTRAINT "WebDevFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
