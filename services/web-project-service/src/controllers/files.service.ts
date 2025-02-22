import { prisma } from "db";
import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

export const handleReadFiles = async (req: Request, res: Response) => {
  // const userId = Number(req.query.userId);
  const projectName = String(req.query.project);
  console.log("projectName: ", projectName);
  try {
    const files = await getFileTree(`./projects/${projectName}`);
    return res.status(200).json({
      success: true,
      msg: "Files found successfully",
      files,
    });
  } catch (error) {
    console.error("Error while reading files: ", error);
    res.status(404).json({
      success: false,
      msg: "Files not found",
      error: error,
    });
  }
};

async function getFileTree(directory: string) {
  console.log("directory: ", directory);
  const tree: Record<string, any> = {};
  async function buildTree(
    currentDir: string,
    currentTree: Record<string, any>
  ): Promise<void> {
    const files = await fs.readdir(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }

  await buildTree(directory, tree);
  return tree;
};

export const handleCreateFile = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.error("Error while creating a file: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error"
    });
  };
};

// when a file is clicked by a user, the content is fetched from the database
// export const handleFetchFileContent = async (req: Request, res: Response) => {
//   try {
//     const fileContent = await prisma.webdevFile.findUnique({
//       where: {
//         fileId_projectId: {
//           fileId: 
//         }
//       }
//     })
//   } catch (error) {
//     console.error("Error while fetching file content: ", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Internal Server Error"
//     });
//   };
// };
