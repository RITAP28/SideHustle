import { Request, Response } from "express";
import uploadQueue from "../utils/queue";
import sharp from 'sharp'

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

export const handleUploadVideos = async (req: Request, res: Response) => {
    const videoTitle = req.body.title as string;
    const videoDescription = req.body.description as string;
    const videoFile = (req as MulterRequest).files.video?.[0];
    const videoThumbnail = (req as MulterRequest).files.thumbnail?.[0];

    const userId = (req as MulterRequest).user.id as number;
    console.log("User id is: ", userId);

    console.log("Video title: ", videoTitle);
    console.log("Video description: ", videoDescription);
    console.log("Video file: ", videoFile?.buffer);
    console.log("Video thumbnail: ", videoThumbnail?.buffer);

    if(!videoTitle || !videoDescription || !videoFile || !videoThumbnail){
        console.log("All fields are required");
        return res.status(400).json({
            success: false,
            msg: "All fields are required"
        });
    };

    if(!videoFile.buffer || !videoThumbnail.buffer){
        console.log("File data is missing");
        return res.status(400).json({
            success: false,
            msg: "File data is missing"
        });
    };

    console.log('The thumbnail has buffer data as: ', videoThumbnail.buffer);
    console.log("The video has buffer data as: ", videoFile.buffer);

    const modifiedImageBuffer = await sharp(videoThumbnail.buffer)
    .resize(800, 600, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .withMetadata()
    .webp({
      quality: 80,
    })
    .toBuffer();

  if (!modifiedImageBuffer) {
    console.log("Failed to convert the thumbnail into a webp");
    throw new Error("Failed to convert the thumbnail into a webp");
  }

    try {
        const newJob = await uploadQueue.add('uploadJob', {
            videoFile,
            videoThumbnail,
            videoTitle,
            videoDescription,
            modifiedImageBuffer,
            userId
        }, {
            attempts: 3
        });
        // console.log("The new job is: ", newJob);

        console.log(`Video ${videoTitle} added to queue and Upload Job created successfully with id ${newJob.id}`);
        return res.status(200).json({
            success: true,
            msg: `Video ${videoTitle} added to queue and Upload Job created successfully with id ${newJob.id}`,
        });
    } catch (error) {
        console.error("Error while adding video to upload queue: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};