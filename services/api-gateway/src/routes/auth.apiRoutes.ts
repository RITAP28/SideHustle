import express, { Request, Response } from "express";
import axios from "axios";
import { sendResponse } from "../utils/sendResponse";

const authAPIRouter = express.Router();
const AUTH_SERVER_URL = process.env.AUTH_SERVICE_URL;

// ------------------ REGISTER route ------------------
authAPIRouter.post(
  "/register",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await axios.post(`${AUTH_SERVER_URL}/register`, req.body);
      if (response.data.success) {
        sendResponse(res, 200, true, "User registered successfully");
      }
    } catch (error) {
      console.error(
        "Error while accessing /register from the user service: ",
        error
      );
      sendResponse(
        res,
        500,
        false,
        "User server is unavailable. Please try again"
      );
    }
  }
);

// ------------------ LOGIN route ------------------
authAPIRouter.post(
    "/login",
    async (req: Request, res: Response) => {
        try {
            const loginResponse = await axios.post(`${AUTH_SERVER_URL}/login`, req.body);
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
        const logoutResponse = await axios.post(`${AUTH_SERVER_URL}/logout`);
        if (logoutResponse.data.success) {
            return sendResponse(res, 200, true, "Logged out successfully");
        }
    } catch (error) {
        console.error("Error while logging out: ", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
})