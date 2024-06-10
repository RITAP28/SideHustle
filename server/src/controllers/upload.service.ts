import { NextFunction, Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { exec } from "child_process";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface MulterRequest extends Request {
    file: any;
}

// controller that lets a user upload a video
export const handleUploadVideo = async (req: Request, res: Response) => {
    const lessonId = uuidv4();
    const videoPath = (req as MulterRequest).file?.path;
    const title = req.body.title;
    const outputPath = path.join(__dirname, 'uploads', lessonId);
    const hlsPath = path.join(outputPath, 'index.m3u8');
    console.log("hlsPath", hlsPath);

    try {
        if(!fs.existsSync(outputPath)){
            fs.mkdirSync(outputPath, {
                recursive: true
            });
        };
    
        const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
    
        exec(ffmpegCommand, async (error, stdout, stderr) => {
            if(error){
                console.log(`error: ${error.message}`);
            };
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            const videoURL = `http://localhost:${process.env.PORT}/uploads/${lessonId}/index.m3u8`;
            // try {
            //     await prisma.videos.create({
            //         data: {
            //             videoId: lessonId,
            //             title: title,
            //             dateOfPublishing: new Date(Date.now()),
            //             link: videoURL
            //         }
            //     });

            //     res.status(200).json({
            //         success: true,
            //         msg: "video uploaded successfully"
            //     });
            // } catch (error) {
            //     console.error("Error while inserting the video into the database: ", error);
            // }
            res.status(200).json({
                success: true,
                msg: "Video uploaded successfully"
            });
        });
    } catch (error) {
        console.log("Error: ", error);
    };  
    console.log("Uploaded successfully");
};