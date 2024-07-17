import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

export const handleCodeEditor = async (req: Request, res: Response) => {
  const { language, sourceCode } = req.body;
  if (!language || !sourceCode) {
    return res.status(404).json({
      success: false,
      msg: "Enter all fields",
    });
  }
  try {
  } catch (error) {
    console.error("Error while processing the code: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

export const handleCreateNewFile = async (req: Request, res: Response) => {
  const { template, fullName, version } = req.body;
  const userId = Number(req.query.userId);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (!template || !fullName) {
      return res.status(404).json({
        success: false,
        msg: "Both fields are required",
      });
    };

    let content: string = "null";

    const publicPath = path.resolve("public", "files");
    if(!fs.existsSync(publicPath)){
        fs.mkdirSync(publicPath, { recursive: true });
    };
    const filePath = path.join(publicPath, fullName);
    fs.writeFile(filePath, content, (err) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                msg: "Error creating a file"
            });
        };
        console.log("file created");
    });

    const existingFile = await prisma.file.findUnique({
        where: {
            filename_userId: {
                filename: fullName,
                userId: userId
            }
        }
    });

    if(existingFile){
        return res.status(409).json({
            success: false,
            msg: "File already exists",
            error: "Conflict with existing file"
        });
    };

    const fileCreated = await prisma.file.create({
        data: {
            filename: fullName,
            template: template,
            version: version,
            content: content,
            userId: userId,
            username: user.name,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now())
        }
    });

    return res.status(200).json({
        success: true,
        msg: "File created successfully",
        fileCreated
    });
  } catch (error) {
    console.error("Error creating a file: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

export const handleGetAllFiles = async (req: Request, res: Response) => {
    try {
        const files = await prisma.file.findMany({
            where: {
                userId: Number(req.query.userId)
            }
        });
        return res.status(200).json({
            success: true,
            msg: "Files found successfully",
            files
        });
    } catch (error) {
        console.error("Error while getting files: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleGetSpecificFile = async (req: Request, res: Response) => {
    try {
        const filename = req.query.filename as string;
        const file = await prisma.file.findUnique({
            where: {
                filename_userId: {
                    filename: filename,
                    userId: Number(req.query.userId)
                }
            }
        });
        if(!file){
            return res.status(404).json({
                success: false,
                msg: "File not found"
            });
        };
        return res.status(200).json({
            success: true,
            msg: "File found successfully",
            file
        });
    } catch (error) {
        console.error("Error while getting this specific file: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleUpdateContent = async (req: Request, res: Response) => {
    try {
        const filename = String(req.query.filename);
        const userId = Number(req.query.userId);
        const { content } : {
            content: string
        } = req.body;

        const updatedFile = await prisma.file.update({
            where: {
                filename_userId: {
                    filename: filename,
                    userId: userId
                }
            },
            data: {
                content: content,
                updatedAt: new Date(Date.now())
            }
        });

        if(!updatedFile){
            return res.status(404).json({
                success: false,
                msg: "File not updated for some reasons"
            });
        };

        return res.status(200).json({
            success: true,
            msg: "Content updated successfully",
            updatedFile
        });
    } catch (error) {
        console.error("Error while updating content: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};
