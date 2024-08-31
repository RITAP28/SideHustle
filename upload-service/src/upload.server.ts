import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './routes/route';
import { createClient } from 'redis';

export const redisClient = createClient();

const app = express();
const PORT = 8083;

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:7070'],
        credentials: true
    })
);

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use('/', router());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})