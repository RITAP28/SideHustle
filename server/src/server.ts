import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes/user.routes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8001;

app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("./uploads", express.static(path.join(__dirname, "uploads")));
app.use('/', router());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});
