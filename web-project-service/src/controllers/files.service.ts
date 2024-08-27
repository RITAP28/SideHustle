import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

export const handleReadFiles = async (req: Request, res: Response) => {
  try {
    const projectName = String(req.query.project);
    console.log(req.query);
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
}

export const handleFetchSingularFile = async (req: Request, res: Response) => {
  try {
    const fileName = String(req.query.fileName);
  } catch (error) {
    console.error("Error fetching this singular file: ", error);
    return res.status(404).json({
      success: false,
      msg: "File not found",
      error: error
    });
  };
};
