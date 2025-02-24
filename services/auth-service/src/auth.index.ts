import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log(`Auth Service up and running on port ${port}!`);
});
