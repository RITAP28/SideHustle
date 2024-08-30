import express from 'express';
import cors from 'cors';
import router from './routes/user.routes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createClient } from 'redis';

export const redisClient = createClient();
redisClient.on('error', (err) => {
    console.log('Redis client error: ', err);
});
const app = express();
const PORT = 7070;

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://side-hustle-frontend-alpha.vercel.app', 'http://localhost:8083'],
        credentials: true,
    })
);

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use('/', router());

async function startServer() {
    try {
        await redisClient.connect();
        console.log('Redis server connected successfully');

        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`)
        });
    } catch (error) {
        console.log(`Error starting server: `, error);
    };
};

startServer();
