import { prisma } from "db";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { sendOTPMiddleware } from "../../middleware/otp.middleware";
import { sendToken } from "../../middleware/token.middleware";
import { findExistingUser } from "../repositories/auth.repository";
import { sendResponse } from "../utils/utils";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!req.body.name || !req.body.email || !req.body.password) {
    return sendResponse(res, 400, false, "All fields are required");
  }
  try {
    const existingUser = await findExistingUser(email);

    if (existingUser) {
      return sendResponse(res, 400, false, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        isAuthenticated: true,
      },
    });

    await sendOTPMiddleware(req, res, newUser.email);
    console.log("User registered initially...");

    await sendToken(newUser, 200, res);
    return sendResponse(res, 200, true, "User registered successfully", { newUser });
  } catch (error) {
    console.error("Error while registering a user: ", error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};
