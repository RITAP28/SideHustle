import { Queue } from "bullmq";
import { Redis } from "ioredis";
import dotenv from 'dotenv';

dotenv.config();

const urlRedis = process.env.REDIS_URL as string;

const redisConnection = new Redis();

const uploadQueue = new Queue("uploadQueue", {
    connection: redisConnection
});

export default uploadQueue;