import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { prisma } from "db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import { ConnectionOptions, Worker } from "bullmq";
import sharp from "sharp";
import { Request } from "express";

dotenv.config();

// const urlRedis = process.env.REDIS_URL as string;

// const redisConnection = new Redis(urlRedis, {
//   lazyConnect: true,
//   enableOfflineQueue: false,
//   maxRetriesPerRequest: null,
// });

const redisConnection: ConnectionOptions = {
  host: "localhost",
  port: 6379,
};

const bucketName = String(process.env.BUCKET_NAME);
const bucketRegion = String(process.env.BUCKET_REGION);
const accessKeyId = String(process.env.ACCESS_KEY_ID);
const secretAccessKey = String(process.env.SECRET_ACCESS_KEY);

interface buffer {
  type: string;
  data: ArrayBuffer;
}

//configuring the s3 client
const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: bucketRegion,
});

// initiating upload function
const initiateUpload = async (key: string) => {
  try {
    const initiateVideoUpload = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: "video/mp4",
    });
    const upload = await s3Client.send(initiateVideoUpload);
    return upload.UploadId; //returns an upload id
  } catch (error) {
    console.error("Error while initiating upload: ", error);
  }
};

// uploading video parts-by-parts
const uploadParts = async (
  Bucket: string,
  key: string,
  uploadId: string,
  partNumber: number,
  Part: Uint8Array | string | Blob | Buffer
) => {
  const uploadPartsParams = {
    Bucket: Bucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
    Body: Part,
  };

  const uploadPartCommand = new UploadPartCommand(uploadPartsParams);
  const videoUploaded = await s3Client.send(uploadPartCommand);

  // an entity tag is returned for the part as a header in the videoUploaded
  return videoUploaded.ETag;
};

// code for completing the upload completely
const completeUpload = async (
  Bucket: string,
  Key: string,
  UploadId: string,
  parts: {
    ETag: string;
    PartNumber: number;
  }[]
) => {
  try {
    const completeVideoParams = {
      Bucket: Bucket,
      Key: Key,
      UploadId: UploadId,
      MultipartUpload: {
        Parts: parts,
      },
    };
    const completeVideoUpload = new CompleteMultipartUploadCommand(
      completeVideoParams
    );
    const videoUploaded = await s3Client.send(completeVideoUpload);

    return videoUploaded;
  } catch (error) {
    console.log("Error while completing upload: ", error);
  }
};

const uploadThumbnail = async (thumbnailKey: string, buffer: Buffer) => {
  try {
    const thumbnailUploadParams = {
      Bucket: bucketName,
      Key: thumbnailKey,
      Body: buffer,
      ContentType: "image/*",
    };
    const thumbnailUploadCommand = new PutObjectCommand(thumbnailUploadParams);
    const videoUploaded = await s3Client.send(thumbnailUploadCommand);

    return videoUploaded;
  } catch (error) {
    console.error("Error while uploading thumbnail: ", error);
  }
};

// function to get pre-signed URL for both videos and thumbnails
const getPresignedUrl = async (bucket: string, key: string) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 24 * 60 * 60,
    });
    console.log("signedURL is: ", url);
    return url;
  } catch (error) {
    console.error("Error while getting pre-signed url: ", error);
  }
};

const addVideoMetadataToDB = async (
  title: string,
  description: string,
  thumbnailLink: string,
  videoLink: string,
  userId: number
) => {
  try {
    const videoUploaded = await prisma.videos.create({
      data: {
        title: title,
        description: description,
        videoLink: videoLink,
        thumbnailLink: thumbnailLink,
        publisherId: userId,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    console.log(
      "videoUploaded after uploading the video into the database: ",
      videoUploaded
    );
    return videoUploaded;
  } catch (error) {
    console.error("Error while adding video metadata: ", error);
  }
};

export const uploadWorker = async () => {
  const worker = new Worker(
    "uploadQueue",
    async (job) => {
      if (job.name === "uploadJob") {
        const {
          videoTitle,
          videoDescription,
          videoFile,
          videoThumbnail,
          modifiedImageBuffer,
          userId,
        }: {
          videoTitle: string;
          videoDescription: string;
          videoFile: Express.Multer.File;
          videoThumbnail: Express.Multer.File;
          modifiedImageBuffer: Buffer;
          userId: number;
        } = job.data;
        console.log("job data: ", job.data);
        console.log(`Upload Worker started`);
        console.log(`Processing job with ${job.id}`);
        console.log(`user id is: `, userId);

        if (!userId) {
          throw new Error("User id is missing");
        }

        const thumbnailBuffer = videoThumbnail.buffer as Buffer;
        const videoBuffer = videoFile.buffer as Buffer;

        // checking for thumbnail buffer and logging in the console
        if (!thumbnailBuffer) {
          throw new Error("Buffer in Thumbnail is missing");
        }
        console.log("Thumbnail buffer: ", thumbnailBuffer);

        // checking for video buffer and logging in the console
        if (!videoBuffer) {
          throw new Error("Buffer in video is missing");
        }
        console.log("Video buffer: ", videoBuffer);

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random())}`;
        const filename = `${path.basename(
          videoThumbnail.originalname,
          path.extname(videoThumbnail.originalname)
        )}-${uniqueSuffix}.webp`;

        // keys for initiating upload
        // thumbnail key
        const thumbnailKey = `thumbnails/${filename}`;
        console.log("Thumbnail Key: ", thumbnailKey);
        // video key
        const videoKey = `videos/${videoTitle}.mp4`;
        console.log("Video key: ", videoKey);

        try {
          const uploadId = await initiateUpload(videoKey);
          if (!uploadId) {
            console.error(`Failed to initiate upload for video ${videoTitle}`);
            throw new Error(
              `Failed to initiate upload for video ${videoTitle}`
            );
          }

          // uploading the video chunk-by-chunk
          const chunkSize = 5 * 1024 * 1024; // size of each chunk = 5MB
          const videoParts = [];
          for (
            let start = 0, partNumber = 1;
            start < videoBuffer.byteLength;
            start += chunkSize, partNumber++
          ) {
            const end = Math.min(start + chunkSize, videoBuffer.byteLength);
            const part = videoBuffer.subarray(start, end);
            const ETag = await uploadParts(
              bucketName,
              videoKey,
              uploadId,
              partNumber,
              part
            );
            console.log(`Etag information for part with ${partNumber}: `, ETag);

            // pushing the information about the part into the videoParts array
            videoParts.push({
              ETag: ETag as string,
              PartNumber: partNumber as number,
            });
          }

          // completing the video upload into the s3 bucket
          await completeUpload(bucketName, videoKey, uploadId, videoParts);
          console.log("Video uploaded successfully to S3");

          // uploading the thumbnail file to the s3 bucket alongside bucket
          await uploadThumbnail(thumbnailKey, modifiedImageBuffer);
          console.log("Thumbnail uploaded successfully to S3");

          const videoURL = (await getPresignedUrl(
            bucketName,
            videoKey
          )) as string;
          const thumbnailURL = (await getPresignedUrl(
            bucketName,
            thumbnailKey
          )) as string;

          // adding the video metadata to the database
          const videoUploadedtoDatabase = await addVideoMetadataToDB(
            videoTitle,
            videoDescription,
            thumbnailURL,
            videoURL,
            userId
          );
          console.log(videoUploadedtoDatabase);

          console.log(
            `Video with title ${videoTitle} uploaded successfully to ${bucketName}`
          );
        } catch (error) {
          console.error(`Error processing job with id ${job.id}: `, error);
          throw new Error(`Error processing job with id ${job.id}`);
        }
      }
    },
    {
      connection: redisConnection,
    }
  );

  worker.on("completed", (job) => {
    console.log(`Job with id ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job with id ${job?.id} failed: `, err);
  });

  worker.on("ready", () => {
    console.log("Worker is ready to process jobs.");
  });

  worker.on("drained", () => {
    console.log("Worker has finished processing all jobs.");
  });
};
