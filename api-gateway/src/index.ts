import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

// Define routes for each microservices
