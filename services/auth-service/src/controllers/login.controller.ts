import { Request, Response } from "express";
import { findExistingUser } from "../repositories/auth.repository";
import bcrypt from "bcrypt";
import { IUserProps } from "../utils/interface";
import { sendToken } from "../../middleware/token.middleware";
import { sendResponse } from "../utils/utils";

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        sendResponse(res, 400, false, "Both email and password are required");
        return;
    };
    try {
      const existingUser = await findExistingUser(email) as IUserProps;
      if(!existingUser){
        sendResponse(res, 401, false, "User does not exist");
        return;
      }
      const validPassword = await bcrypt.compare(password, existingUser.password);
      if(!validPassword) {
        sendResponse(res, 401, false, "Invalid password");
        return;
      };
      sendToken(existingUser, 200, res);
      console.log("logged in successfully");
      sendResponse(res, 200, true, "Logged in successfully");
    } catch (error) {
      console.error("Error while logging in: ", error);
      sendResponse(res, 500, false, "Internal Server Error");
      return;
    };
  };