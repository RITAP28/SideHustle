import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { sendResponse } from "../utils/sendResponse";

dotenv.config();

const authAPIRouter = express.Router();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

// ------------------ REGISTER route ------------------
authAPIRouter.post(
  `/register`,
  async (req: Request, res: Response) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/register`, req.body);
      if (response.data.success) {
        return sendResponse(res, 200, true, "User registered successfully");
      }
    } catch (error) {
      console.error(
        "Error while accessing /register from the auth service: ",
        error
      );
      return sendResponse(
        res,
        500,
        false,
        "Auth server is unavailable. Please try again"
      );
    }
  }
);

// ------------------ LOGIN route ------------------
authAPIRouter.post(
    "/login",
    async (req: Request, res: Response) => {
        try {
            const loginResponse = await axios.post(`${AUTH_SERVICE_URL}/login`, req.body);
            if (loginResponse.data.success) {
                sendResponse(res, 200, true, "User logged in successfully", loginResponse.data.data);
            }
        } catch (error) {
            console.error("Error while logging in: ", error);
            return sendResponse(res, 500, false, "Internal Server Error");
        }
    }
)

// ------------------ LOGOUT route ------------------

authAPIRouter.post("/logout", async (req: Request, res: Response) => {
    try {
        const logoutResponse = await axios.post(`${AUTH_SERVICE_URL}/logout`);
        if (logoutResponse.data.success) {
            return sendResponse(res, 200, true, "Logged out successfully");
        }
    } catch (error) {
        console.error("Error while logging out: ", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
})

export default authAPIRouter;