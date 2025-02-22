import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './routes/route';
import { createClient } from 'redis';
import uploadQueue from './utils/queue';
dotenv.config();

export const redisClient = createClient();
redisClient.on('error', (err) => {
    console.log('Redis client error: ', err);
});

const app = express();
const PORT = 8083;

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:7070'],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use('/', router());


async function startUploadServer() {
    try {
        await redisClient.connect();
        console.log('Redis server connected successfully to upload service');

        const waitingJobs = await uploadQueue.getWaiting();
        const completedJobs = await uploadQueue.getCompleted();
        const activeJobs = await uploadQueue.getActive();
        const failedJobs = await uploadQueue.getFailed();

        // console.log("waiting jobs: ", waitingJobs);
        // console.log("completed jobs: ", completedJobs);
        // console.log("active jobs: ", activeJobs);
        // console.log("failed jobs: ", failedJobs);

        app.listen(PORT, () => {
            console.log(`Upload Server listening on ${PORT}`);
        });

    } catch (error) {
        console.error('Error starting upload server: ', error);
    };
};

startUploadServer();