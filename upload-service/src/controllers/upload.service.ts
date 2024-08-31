import { Request, Response } from "express";
import uploadQueue from "../utils/queue";

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

    if(!videoTitle || !videoDescription || !videoFile || !videoThumbnail){
        return res.status(400).json({
            success: false,
            msg: "All fields are required"
        });
    };

    try {
        const newJob = await uploadQueue.add('uploadJob', {
            videoFile,
            videoThumbnail,
            videoTitle,
            videoDescription,
            userId
        });

        return res.status(200).json({
            success: true,
            msg: `Video ${videoTitle} added to queue and Upload Job created successfully with id ${newJob.id}`
        });
    } catch (error) {
        console.error("Error while adding video to upload queue: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};