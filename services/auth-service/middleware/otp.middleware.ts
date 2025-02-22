import { Request, Response } from "express";
import { getExistingUser, sendEmail, sendResponse } from "../src/utils/utils";
import crypto from "crypto";
import { prisma } from "db";
import bcrypt from "bcrypt";
import { IUserProps } from "../src/utils/interface";

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // generates a 6-digit OTP
};

export const sendOTPMiddleware = async (
  req: Request,
  res: Response,
  email: string
) => {
  if (!email) {
    return sendResponse(res, 400, false, "Something went wrong...");
  }

  try {
    const existingUser = await getExistingUser(req, res, email) as IUserProps;

    const otp = generateOTP();
    console.log("OTP generated is: ", otp);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    const newOTP = await prisma.oTP.create({
      data: {
        email: email,
        otp: hashedOtp,
        otpExpiresAt: otpExpiry,
        userId: existingUser.id,
      },
    });
    console.log("new OTP has been generated");
    await sendEmail({
      to: email,
      subject: "OTP for verification",
      text: `your OTP is: ${otp}`,
    });

    console.log("newOTP is: ", newOTP);
    console.log("OTP is sent to new user's email address");
  } catch (error) {
    console.error("Error while generating otp: ", error);
    return sendResponse(res, 500, false, "Error generating OTP");
  }
};

export const verifyOTPMiddleware = async (req: Request, res: Response) => {
  const {
    email,
    otp,
  }: {
    email: string;
    otp: string;
  } = req.body;
  if (!otp) {
    return res.status(400).json({
      success: false,
      msg: "Enter the otp",
    });
  }
  try {
    const existingOTP = await prisma.oTP.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingOTP) {
      return res.status(400).json({
        success: false,
        msg: "user not found",
      });
    }

    const otpComparison = await bcrypt.compare(otp, existingOTP.otp);

    if (!otpComparison || existingOTP.otpExpiresAt < new Date(Date.now())) {
      return res.status(400).json({
        success: false,
        msg: "Invalid OTP",
      });
    }

    // OTP is verified
    // OTP, stored in the database, is deleted
    await prisma.oTP.delete({
      where: {
        email: email,
      },
    });
    console.log("OTP has been deleted from the database");

    // the isVerified field of the user should turn to true
    const existingUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        isVerified: true,
      },
    });
    console.log("User has been verified");

    return res.status(200).json({
      success: true,
      msg: "OTP and user, both are verified",
      existingUser,
    });
  } catch (error) {
    console.log("Error while verifying OTP: ", error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};
