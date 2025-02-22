import { S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";


const bucketName = process.env.BUCKET_NAME as string;
const bucketRegion = process.env.BUCKET_REGION as string;
const accessKeyId = process.env.ACCESS_KEY_ID as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;

// configuring the s3 bucket
const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});



export const handleTranscodeVideo = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error("Error while transcoding video: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};