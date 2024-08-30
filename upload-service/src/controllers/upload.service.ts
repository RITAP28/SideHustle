import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { prisma } from "db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config()

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

const bucketName = String(process.env.BUCKET_NAME);
// const bucketName = 'nexuscode-videos-uploaded';
const bucketRegion = String(process.env.BUCKET_REGION);
// const bucketRegion = 'ap-south-1';
const accessKeyId = String(process.env.ACCESS_KEY_ID);
const secretAccessKey = String(process.env.SECRET_ACCESS_KEY);

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

const uploadThumbnail = async (thumbnailKey: string) => {
  try {
    const thumbnailUploadParams = {
      Bucket: bucketName,
      Key: thumbnailKey,
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

// main api for uploading videos in aws S3 bucket
export const handleUploadVideos = async (req: Request, res: Response) => {
  const randomId = uuidv4();

  // information sent across the request
  const videoTitle = req.body.title;
  const videoDescription = req.body.description;
  const videoFile = (req as MulterRequest).files.video?.[0];
  const videoThumbnail = (req as MulterRequest).files.thumbnail?.[0];

  // information about the user
  const userId = (req as MulterRequest).user.id;
  const userName = (req as MulterRequest).user.name;
  const userEmail = (req as MulterRequest).user.email;

  if (!videoTitle || !videoDescription || !videoFile || !videoThumbnail) {
    return res.status(404).json({
      success: false,
      msg: "All fields are required",
    });
  };

  console.log(bucketName);
  console.log(bucketRegion);
  console.log(accessKeyId);

  // key for initiating upload
  // video key
  const videoKey = `videos/${videoTitle}.mp4`;
  console.log("Video key: ", videoKey);

  const thumbnailName = path.parse(videoThumbnail.originalname).name;
  const thumbnailExt = path.parse(videoThumbnail.originalname).ext;

  // thumbnail key
  const thumbnailKey = `thumbnails/${thumbnailName}-${randomId}${thumbnailExt}`;
  console.log("Thumbnail Key: ", thumbnailKey);

  try {
    const uploadId = await initiateUpload(videoKey);
    if (!uploadId) {
      return res.status(500).json({
        success: false,
        msg: "Internal Server Error",
      });
    }

    // uploading the video chunk-by-chunk
    const chunkSize = 5 * 1024 * 1024; // size of each chunk = 5MB
    const videoParts = [];
    for (
      let start = 0, partNumber = 1;
      start < videoFile.buffer.length;
      start += chunkSize, partNumber++
    ) {
      const end = Math.min(start + chunkSize, videoFile.buffer.length);
      const part = videoFile.buffer.subarray(start, end);
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
    await uploadThumbnail(thumbnailKey);
    console.log("Thumbnail uploaded successfully to S3");

    const videoURL = (await getPresignedUrl(bucketName, videoKey)) as string;
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

    return res.status(200).json({
        success: true,
        msg: "Video uploaded successfully",
        video: videoUploadedtoDatabase
    });
  } catch (error) {
    console.error("Error while uploading videos: ", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
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
