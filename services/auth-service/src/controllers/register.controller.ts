import { prisma } from "db";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { sendOTPMiddleware } from "../../middleware/otp.middleware";
import { sendToken } from "../../middleware/token.middleware";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      msg: "Enter all fields",
    });
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        name: name as string,
        email: email as string,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists",
      });
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

    // return sendToken(newUser, 200, res);

    await sendOTPMiddleware(req, res, newUser.email);
    console.log("User registered initially...");

    return sendToken(newUser, 200, res);
  } catch (error) {
    console.error("Error while registering a user: ", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};
