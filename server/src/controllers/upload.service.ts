import { NextFunction, Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { exec } from "child_process";

interface MulterRequest extends Request {
    file: any;
}

// controller that lets a user upload a video
export const handleUploadVideo = async (req: Request, res: Response, next: NextFunction) => {
    const lessonId = uuidv4();
    const videoPath = (req as MulterRequest).file?.path;
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
    
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if(error){
                console.log(`error: ${error.message}`);
            };
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            const videoURL = `http://localhost:${process.env.PORT}/uploads/${lessonId}/index.m3u8`;
            res.json({
                message: "video converted to hls format",
                videoURL: videoURL, // video link
                lessonId: lessonId // video id
            });
        });


    } catch (error) {
        console.log("Error: ", error);
    };  
};