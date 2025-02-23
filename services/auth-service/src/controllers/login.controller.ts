import { Request, Response } from "express";
import { findExistingUser } from "../repositories/auth.repository";
import bcrypt from "bcrypt";
import { IUserProps } from "../utils/interface";
import { sendToken } from "../../middleware/token.middleware";

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "All the fields are required"
        })
    };
    try {
      const existingUser = await findExistingUser(email) as IUserProps;
      if(!existingUser){
        res.status(401).json({
            status: 401,
            success: false,
            message: "User not found"
        });
      }
      const validPassword = await bcrypt.compare(password, existingUser.password);
      if(!validPassword) {
        res.status(401).json({
            status: 401,
            success: false,
            message: "Invalid Password"
        });
      };
      sendToken(existingUser, 200, res);
      console.log("logged in successfully");
      res.status(200).json({
        status: 200,
        success: true,
        message: "Logged in successfully"
      });
    } catch (error) {
      console.error("Error while logging in: ", error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error"
      });
    };
  };