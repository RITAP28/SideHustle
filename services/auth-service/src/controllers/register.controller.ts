import { prisma } from "db";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { sendOTPMiddleware } from "../../middleware/otp.middleware";
import { sendToken } from "../../middleware/token.middleware";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).json({
      success: false,
      msg: "Enter all fields",
    });
    return;
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        name: name as string,
        email: email as string,
      },
    });

    if (existingUser) {
      res.status(400).json({
        msg: "User already exists",
      });
      return;
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

    sendToken(newUser, 200, res);
  } catch (error) {
    console.error("Error while registering a user: ", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};
