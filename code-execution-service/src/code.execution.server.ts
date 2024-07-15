import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8081;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Code-execution server listening on port ${PORT}`);
});