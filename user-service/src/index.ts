import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.USER_BASE_PORT || 5431;

app.use(express.json());