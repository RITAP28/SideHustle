import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

const app = express();
const PORT = 8084;

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
