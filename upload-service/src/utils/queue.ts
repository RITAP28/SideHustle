import { ConnectionOptions, Queue } from "bullmq";
import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const urlRedis = process.env.REDIS_URL as string;

// const redisConnection: ConnectionOptions = new Redis(urlRedis, {
//   lazyConnect: true,
//   enableOfflineQueue: false,
//   maxRetriesPerRequest: null,
// });

export const redisConnection: ConnectionOptions = {
    host: 'localhost',
    port: 6381
};


const uploadQueue = new Queue("uploadQueue", {
  connection: redisConnection,
});

export default uploadQueue;
