import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { redisClient } from "../server";
import { uuid } from "uuidv4";
import { exec } from "child_process";
const prisma = new PrismaClient();

interface File {
  filename: string;
  template: string;
  version: string;
  content: string;
  userId: number;
  username: string;
}

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
  const {
    template,
    fullName,
    version,
  }: {
    template: string;
    fullName: string;
    version: string;
  } = req.body;
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
    }

    let content: string = "null";

    const publicPath = path.resolve("public", "files");
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    const filePath = path.join(publicPath, fullName);
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          msg: "Error creating a file",
        });
      }
      console.log("file created");
    });

    const existingFile = await prisma.file.findUnique({
      where: {
        filename_userId: {
          filename: fullName,
          userId: userId,
        },
      },
    });

    if (existingFile) {
      return res.status(409).json({
        success: false,
        msg: "File already exists",
        error: "Conflict with existing file",
      });
    }

    const fileCreated = await prisma.file.create({
      data: {
        filename: fullName,
        template: template,
        version: version,
        content: content,
        userId: userId,
        username: user.name,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
    });

    return res.status(200).json({
      success: true,
      msg: "File created successfully",
      fileCreated,
    });
  } catch (error) {
    console.error("Error creating a file: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

export const handleRunCode = async (req: Request, res: Response) => {
  try {
    const {
      language,
      fullName,
      version,
      content,
      userId
    }: {
      language: string;
      fullName: string;
      version: string;
      content: string;
      userId: number;
    } = req.body;


    const existingFile = await prisma.file.findUnique({
      where: {
        filename_userId: {
          filename: fullName,
          userId: userId,
        },
      },
    });

    if (!existingFile) {
      return res.status(404).json({
        success: false,
        msg: "File not found",
      });
    }

    let codeFileName;
    let imageName;

    switch (language) {
        case 'python':
            codeFileName = fullName;
            imageName = 'python-runner';
            break;
        case 'javascript':
            codeFileName = fullName;
            imageName = 'javascript-runner';
            break;
        case 'java':
            codeFileName = fullName.replace('java', '');
            imageName = 'java-runner';
            break;
        default:
            return res.status(400).json({ error: 'Unsupported language' });
    }

    const codeFilePath = path.join(__dirname, 'public', 'files', codeFileName);
    // await fs.promises.writeFile(codeFilePath, content);
    fs.writeFile(codeFilePath, content, (err) => {
        if(err){
            console.error(err);
        } else {
            console.log('file written successfully')
        }
    });

    const command = `docker run --rm -v ${codeFilePath}:/public/files/${codeFileName} -e CODE_FILE=${codeFileName} ${imageName}`;

    exec(command, (error, stdout, stderr) => {
      // Clean up the temporary file
      fs.unlinkSync(codeFilePath);

      if (error) {
        res.json({ error: stderr });
      } else {
        res.json({ output: stdout });
      }
    });

    let cacheKey = fullName;
    // await redisClient.set(cacheKey, JSON.stringify(content), {
    //     EX: 3600,
    //     NX: true
    // });
    await prisma.file.update({
        where: {
            filename_userId: {
                filename: fullName,
                userId: userId
            }
        },
        data: {
            content: content,
            updatedAt: new Date(Date.now())
        }
    });
  } catch (error) {
    console.error("Error while running the code: ", error);
  }
};

export const handleGetAllFiles = async (req: Request, res: Response) => {
  let isCached = false;
  const cacheKey = "allFiles";
  try {
    const cachedFiles = await redisClient.get(cacheKey);
    if (cachedFiles) {
      let files: Array<File> = [];
      isCached: true;
      files = JSON.parse(cachedFiles);
      console.log("All files obtained from redis succesfully.");
      return res.status(200).json({
        success: true,
        msg: "All files retrieved successfully",
        files,
      });
    } else {
      const files = await prisma.file.findMany({
        where: {
          userId: Number(req.query.userId),
        },
      });
      console.log("database queried for files");
      await redisClient.set(cacheKey, JSON.stringify(files), {
        EX: 60,
        NX: true,
      });
      console.log("data set into the redis");
      return res.status(200).json({
        success: true,
        msg: "Files found successfully",
        files,
      });
    }
  } catch (error) {
    console.error("Error while getting files: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

export const handleGetSpecificFile = async (req: Request, res: Response) => {
  try {
    const filename = req.query.filename as string;
    const file = await prisma.file.findUnique({
      where: {
        filename_userId: {
          filename: filename,
          userId: Number(req.query.userId),
        },
      },
    });
    if (!file) {
      return res.status(404).json({
        success: false,
        msg: "File not found",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "File found successfully",
      file,
    });
  } catch (error) {
    console.error("Error while getting this specific file: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

export const handleUpdateContent = async (req: Request, res: Response) => {
  try {
    const filename = String(req.query.filename);
    const userId = Number(req.query.userId);
    const {
      content,
    }: {
      content: string;
    } = req.body;

    const updatedFile = await prisma.file.update({
      where: {
        filename_userId: {
          filename: filename,
          userId: userId,
        },
      },
      data: {
        content: content,
        updatedAt: new Date(Date.now()),
      },
    });

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        msg: "File not updated for some reasons",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Content updated successfully",
      updatedFile,
    });
  } catch (error) {
    console.error("Error while updating content: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};
