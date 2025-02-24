import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authAPIRouter from "./routes/auth.apiRoutes";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
// Define routes for each microservices
app.use("/api/v1/auth", authAPIRouter);

app.get("/", (req: Request, res: Response) => {
  console.log("API Gateway is up and running!");
  res.send("API gateway is up and running!");
});

app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
