import {
  GetObjectCommand,
  PutObjectAclCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { Readable } from "stream";
import { exec } from "child_process";

const bucketName = process.env.BUCKET_NAME as string;
const bucketRegion = process.env.BUCKET_REGION as string;
const accessKeyId = process.env.ACCESS_KEY_ID as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;

// configuring AWS SDK key
const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
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
      Key: key,
    });
    const response = await s3Client.send(command);
    if (!response.Body) {
      throw new Error("Empty code response body");
    }
    // const readableStream: ReadableStream = response.Body.transformToWebStream();
    // const readStream = new ReadableWebToNodeStream(readableStream);
    // readStream.pipe(writeStream);
    const readStream = response.Body as Readable;
    readStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log(`Video Downloaded from ${key} to ${localPath}`);
  } catch (error) {
    console.error("Error while downloading video from S3 bucket: ", error);
  }
};

// resolutions in the array
const resolutions = [
  {
    resolution: "640x360",
    videoBitrate: "800k",
    audioBitrate: "128k",
  },
  {
    resolution: "854x480",
    videoBitrate: "1000k",
    audioBitrate: "128k",
  },
  {
    resolution: "1280x720",
    videoBitrate: "2500k",
    audioBitrate: "128k",
  },
  {
    resolution: "1920x1080",
    videoBitrate: "500k",
    audioBitrate: "128k",
  },
];

const transcodeVideo = async (
  inputPath: string,
  resolution: string,
  audioBitrate: string,
  videoBitrate: string,
  outputFolder: string
) => {
  const outputFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}_${resolution}.m3u8`;
  const segmentFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}_${resolution}_%03d.ts`;

  // const ffmpegCommand = `ffmpeg i ${inputPath} -vf scale=${resolution} -b:v ${videoBitrate} -codec:v libx264 -codec:a aac -b:a ${audioBitrate} -hls_time 10 -hls_playlist_type_vod -hls_list_size 0 -hls_segment_filename ${outputFolder}/${segmentFilename}`;

  // exec(ffmpegCommand, (err, stdout, stderr) => {
  //     if(err){
  //         console.log("Error whlile running the exec command: ", err);
  //         return;
  //     };

  //     console.log("stdout: ", stdout);
  //     console.log("stderr: ", stderr);
  // });

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        `-c:v h264`,
        `-b:v ${videoBitrate}`,
        `-c:a aac`,
        `-b:a ${audioBitrate}`,
        `-vf scale=${resolution}`,
        `-f hls`,
        `-hls_time 10`,
        `-hls_list_size 0`,
        `-hls_segment_filename ${outputFolder}/${segmentFilename}`,
      ])
      .output(`${outputFolder}/${outputFilename}`)
      .on("end", () => resolve(outputFilename))
      .on("error", (err) => reject(err))
      .run();
  });
};

// upload files to s3 bucket successfully
const uploadToS3 = async (
  filePath: string,
  hlsFolder: string,
  file: string
) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Key: `${hlsFolder}/${file}`,
      Body: fileStream,
      ContentType: file.endsWith(".ts")
        ? "video/mp2t"
        : file.endsWith(".m3u8")
        ? "application/x-mpegURL"
        : undefined,
    };
    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);

    console.log("Video uploaded successfully to s3 bucket");
  } catch (error) {
    console.error("Error while uploading back to s3 bucket: ", error);
    throw error;
  }
};

export default async function handleTranscoder() {
  console.log("Starting transcode function...");
  try {
    const localPath = `local.mp4`;
    const videoKey = `videos/ElonMusk#1-1719558571123.mp4`;
    const hlsFolder = "hls";

    console.log("Starting to download video...");
    await downloadVideoFromS3(videoKey, localPath);
    console.log("video downloaded successfully");

    console.log("Starting to transcode...");
    const variantPlaylists = [];
    for (const item in resolutions) {
      const resolutionData = resolutions[item];
      const { resolution, videoBitrate, audioBitrate } = resolutionData;
      const outputFilename = await transcodeVideo(
        resolution,
        videoBitrate,
        audioBitrate,
        localPath,
        hlsFolder
      );
      variantPlaylists.push({ resolution, outputFilename });
      console.log(`HLS conversion done for ${resolution}`);
    }

    console.log("Creating master playlist...");
    // let masterPlaylist = '#EXTM3U\n';
    let masterPlaylist = variantPlaylists
      .map((variantPlaylist) => {
        const { resolution, outputFilename } = variantPlaylist;
        const bandwidth =
          resolution === "640x360"
            ? 676800
            : resolution === "854x480"
            ? 1353600
            : resolution === "1280x720"
            ? 3230400
            : 5000000;
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFilename}`;
      })
      .join("\n");
    masterPlaylist += `#EXTM3U\n`;

    const masterPlaylistFilename = `${videoKey.replace(".", "_")}_master.m3u8`;
    const masterPlaylistFilepath = `hls/${masterPlaylistFilename}`;
    fs.writeFileSync(masterPlaylistFilepath, masterPlaylist);
    console.log("HLS master m3u8 playlist generated");

    console.log("Uploading files to the s3 bucket...");
    const files = fs.readdirSync(hlsFolder);
    for (const file of files) {
      if (!file.startsWith(videoKey.replace(".", "_"))) {
        continue;
      }
      const filePath = path.join(hlsFolder, file);
      await uploadToS3(filePath, hlsFolder, file);
    };

    console.log("Deleting locally downloaded mp4 files...");
    fs.unlinkSync(localPath);
    console.log("Deleted locally downloaded mp4 files");

    console.log("Transcoded and Uploaded .m3u8 and segment.ts files to s3 bucket...");

  } catch (error) {
    console.error("Error while transcoding and uploading files: ", error);
  };
}
