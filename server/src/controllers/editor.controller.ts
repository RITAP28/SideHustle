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
  const { template, fileName } = req.body;
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

    if (!template || !fileName) {
      return res.status(404).json({
        success: false,
        msg: "Both fields are required",
      });
    };

    const publicPath = path.resolve("public", "files");
    if(!fs.existsSync(publicPath)){
        fs.mkdirSync(publicPath, { recursive: true });
    };
    const filePath = path.join(publicPath, fileName);
    fs.writeFile(filePath, "null", (err) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                msg: "Error creating a file"
            });
        };
        console.log("file created");
    });
    return res.status(200).json({
        success: true,
        msg: "File created successfully"
    });
  } catch (error) {
    console.error("Error creating a file: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};
