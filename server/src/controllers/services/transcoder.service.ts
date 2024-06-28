import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs, { ReadStream } from "fs";
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';
import { Readable } from "stream";

const bucketName = process.env.BUCKET_NAME as string;
const bucketRegion = process.env.BUCKET_REGION as string;
const accessKeyId = process.env.ACCESS_KEY_ID as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;

// configuring AWS SDK key
const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

// study about streaming in node js
// streaming basically helps us to transfer the data from one file to another, read or write
// for small files, we can use fs.writeFile or fs.readFile
// but for large file sizes, we can use fs.createWriteStream() and fs.createReadStream()
// also study about the class stream and their custom usecases via building own constructors
const downloadVideoFromS3 = async (key: string, localPath: string) => {
    try {
        const writeStream = fs.createWriteStream(localPath);
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });
        const response = await s3Client.send(command);
        if(!response.Body){
            throw new Error("error in response.Body");
        };
        // const readableStream: ReadableStream = response.Body.transformToWebStream();
        // const readStream = new ReadableWebToNodeStream(readableStream);
        // readStream.pipe(writeStream);
        const readStream = response.Body as Readable;
        readStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        console.log(`Video Downloaded from ${key} to ${localPath}`);
    } catch (error) {
        console.error("Error while downloading video from S3 bucket: ", error);
    };
};

const resolutions = [
    {
        resolution: '640*360',
        videoBitrate: '800k',
        audioBitrate: '128k'
    },{
        resolution: '854*480',
        videoBitrate: '1000k',
        audioBitrate: '128k'
    },{
        resolution: '1280*720',
        videoBitrate: '2500k',
        audioBitrate: '128k'
    },{
        resolution: '1920*1080',
        videoBitrate: '500k',
        audioBitrate: '128k'
    }
];

export default async function handleTranscoder() {
    try {
        const localPath = `local.mp4`;
        const videoKey = `videos/ElonMusk#1-1719558571123.mp4`;
        await downloadVideoFromS3(videoKey, localPath);
    } catch (error) {
        
    }
}