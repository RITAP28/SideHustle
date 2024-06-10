import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes/user.routes';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

const app = express();
const PORT = 7070;

app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    })
);

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("./uploads", express.static(path.join(__dirname, "uploads")));
app.use('/', router());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});
