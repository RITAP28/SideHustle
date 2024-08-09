import { Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import sharp from "sharp";
import dotenv from "dotenv";
import { prisma } from "db";
dotenv.config();
import ffmpeg from "fluent-ffmpeg";

interface MulterRequest extends Request {
  files: {
    video?: Express.Multer.File[];
    thumbnail?: Express.Multer.File[];
  };
  body: {
    title: string;
    description: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const handleUploadVideo = async (req: Request, res: Response) => {
  const lessonId = uuidv4();
  const video = (req as MulterRequest).files.video?.[0];
  const thumbnail = (req as MulterRequest).files.thumbnail?.[0];
  const title = req.body.title;
  const desc = req.body.description;
  const outputPath = path.join("public/videos", lessonId);
  const hlsPath = path.join(outputPath, "index.m3u8");
  console.log("hlsPath", hlsPath);

  if (!video || !thumbnail) {
    return res.status(400).json({
      sucess: false,
      msg: "Both fields are required",
    });
  }

  const userId = (req as MulterRequest).user.id;

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {
      recursive: true,
    });
  }

  console.log(video.path);

  const thumbnailPath = path.join(
    "public/thumbnails",
    `${Date.now()}-${lessonId}`
  );
  try {
    // const resizedImageBuffer = await sharp(thumbnail.path).webp({ quality: 20 }).toFile(thumbnailPath);
    const resizedImageBuffer = await sharp(thumbnail.path)
      .webp({ quality: 20 })
      .toBuffer();
    await fs.promises.writeFile(`${thumbnailPath}.webp`, resizedImageBuffer);
    const thumbnailLink = `http://localhost:${
      process.env.PORT
    }/thumbnails/${path.basename(thumbnailPath)}.webp`;

    const ffmpegCommand = `ffmpeg -i ${video.path} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    exec(ffmpegCommand, async (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      const videoURL = `http://localhost:${process.env.PORT}/videos/${lessonId}/index.m3u8`;

      try {
        await prisma.videos.create({
          data: {
            title: title,
            description: desc,
            dateOfPublishing: new Date(Date.now()),
            link: videoURL,
            thumbnail: thumbnailLink,
            publisherId: userId,
          },
        });

        res.status(200).json({
          success: true,
          msg: "video uploaded successfully",
          videoURL: videoURL,
          lessonId: lessonId,
          title: title,
        });
      } catch (error) {
        console.error(
          "Error while inserting the video into the database: ",
          error
        );
      }
      // Set user as creator of the uploaded video
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isCreator: true,
        },
      });
    });
  } catch (error) {
    console.error("Error while uploading files overall: ", error);
  }
};
