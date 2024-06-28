import { Request, Response } from "express";
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  ListPartsCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { uuid } from "uuidv4";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface MulterRequest extends Request {
  files: {
    video: Express.Multer.File[];
    thumbnail: Express.Multer.File[];
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

const bucketRegion = process.env.BUCKET_REGION as string;
const bucketName = process.env.BUCKET_NAME as string;
const accesskeyid = process.env.ACCESS_KEY_ID as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;

// configuring the AWS S3 client
const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accesskeyid,
    secretAccessKey: secretAccessKey,
  },
});

// initiating the multi-upload
const initiateVideoUpload = async (key: string) => {
  try {
    const multiParams = {
      Bucket: bucketName,
      Key: key,
      ContentType: "video/mp4",
    };

    const initiateVideoUpload = new CreateMultipartUploadCommand(multiParams);
    const upload = await s3Client.send(initiateVideoUpload);
    return upload.UploadId;
  } catch (error) {
    console.error("Error while initiating video upload: ", error);
  }
};

// function to upload parts individually, thus getting the ETag of each individual part
async function uploadParts(
  Bucket: string,
  Key: string,
  UploadId: string,
  PartNumber: number,
  Part: Uint8Array | string | Blob | Buffer
) {
  const uploadPartParams = {
    Bucket: Bucket,
    Key: Key,
    UploadId: UploadId,
    PartNumber: PartNumber,
    Body: Part,
  };

  const uploadPartCommand = new UploadPartCommand(uploadPartParams);
  const response = await s3Client.send(uploadPartCommand);

  return response.ETag;
}

async function completeUpload(
  Bucket: string,
  Key: string,
  UploadId: string,
  parts: {
    ETag: string;
    PartNumber: number;
  }[]
) {
  const completeVideoParams = {
    Bucket: bucketName,
    Key: Key,
    UploadId: UploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  const completeCommand = new CompleteMultipartUploadCommand(
    completeVideoParams
  );
  const response = await s3Client.send(completeCommand);

  return response;
}

async function addVideoMetadataToDB(
  title: string,
  description: string,
  dateOfPublishing: Date,
  videoLink: string,
  thumbnailLink: string,
  publisherId: number
) {
  console.log("Adding video metadata into database...");
  try {
    const res = await prisma.videos.create({
      data: {
        title: title,
        description: description,
        dateOfPublishing: dateOfPublishing,
        link: videoLink,
        thumbnail: thumbnailLink,
        publisherId: publisherId,
      },
    });
    console.log(res);
  } catch (error) {
    console.error("Error while pushing video metadata into db: ", error);
  }
  console.log("Added video metadata to database");
}

async function handleUploadVideo(req: Request, res: Response) {
  const lessonId = uuid();
  const videoFile = (req as MulterRequest).files.video?.[0];
  const thumbnailFile = (req as MulterRequest).files.thumbnail?.[0];
  const title = req.body.title;
  const desc = req.body.description;
  const userId = (req as MulterRequest).user.id;

  const videoKey = `${videoFile.filename}-${Date.now()}.mp4`;
  const thumbnailKey = `${thumbnailFile.filename}-${Date.now()}.${
    thumbnailFile.mimetype
  }`;

  // initial the upload of the video file
  const videoUploadId = await initiateVideoUpload(videoKey);
  if (!videoUploadId) {
    return res.status(500).json({
      success: false,
      msg: "Failed to initiate video upload",
    });
  }

  // now, uploading the video part by part
  try {
    const chunkSize = 5 * 1024 * 1024; // 5 MB
    const videoParts = [];

    for (
      let start = 0, partNumber = 1;
      start < videoFile.buffer.length;
      start += chunkSize, partNumber++
    ) {
      const end = Math.min(start + chunkSize, videoFile.buffer.length);
      const part = videoFile.buffer.subarray(start, end);
      const ETag = (await uploadParts(
        bucketName,
        videoKey,
        videoUploadId,
        partNumber,
        part
      )) as string;
      videoParts.push({
        ETag: ETag,
        PartNumber: partNumber,
      });
    }

    // now, completing the upload as a whole into S3
    try {
      await completeUpload(bucketName, videoKey, videoUploadId, videoParts);

      const videoURL = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${videoKey}`;
      const thumbnailURL = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${thumbnailKey}`;

      await addVideoMetadataToDB(title, desc, new Date(Date.now()), videoURL, thumbnailURL, userId);
      console.log("Uploaded video metadata into database");

      return res.status(200).json({
        success: true,
        msg: "Video uploaded successfully"
      });

    } catch (error) {
      console.error("Error while completing uploading video: ", error);
      return res.status(500).json({
        success: false,
        msg: "Failed to complete uploading video part",
      });
    }
  } catch (error) {
    console.error("Error while uploading video part by part: ", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to upload video part",
    });
  }
}
