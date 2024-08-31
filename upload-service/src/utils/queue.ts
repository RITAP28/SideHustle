import { Queue } from "bullmq";
import { Redis } from "ioredis";

const redisConnection = new Redis();

const uploadQueue = new Queue("uploadQueue", {
    connection: redisConnection
});

export default uploadQueue;