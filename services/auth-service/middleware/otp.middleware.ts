import { Request, Response } from "express";
import { sendEmail, sendResponse } from "../src/utils/utils";
import crypto from "crypto";
import { prisma } from "db";
import bcrypt from "bcrypt";
import { IUserProps } from "../src/utils/interface";
import { createOTP, deleteOTP, getExistingOTP, getExistingUser, makeUserVerified } from "../src/repositories/auth.repository";

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
    console.log("user while making OTP: ", existingUser);

    const otp = generateOTP();
    console.log("OTP generated is: ", otp);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    const newOTP = await createOTP(email, hashedOtp, otpExpiry, existingUser.id);
    console.log("new OTP has been generated");
    // await sendEmail({
    //   to: email,
    //   subject: "OTP for verification",
    //   text: `your OTP is: ${otp}`,
    // });

    console.log("newOTP is: ", newOTP);
    // console.log("OTP is sent to new user's email address");
  } catch (error) {
    console.error("Error while generating otp: ", error);
    throw new Error("Failed to send OTP");
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
  console.log(req.body);
  if (!otp) {
    return res.status(400).json({
      success: false,
      msg: "Enter the otp",
    });
  }
  try {
    const existingOTP = await getExistingOTP(email);

    if (!existingOTP) {
      return sendResponse(res, 404, false, "OTP not found");
    }

    const otpComparison = await bcrypt.compare(otp, existingOTP.otp);

    if (!otpComparison || existingOTP.otpExpiresAt < new Date(Date.now())) {
      return sendResponse(res, 400, false, "Invalid OTP");
    }

    // OTP is verified
    // OTP, stored in the database, is deleted
    await deleteOTP(email);
    console.log("OTP has been deleted from the database");

    // the isVerified field of the user should turn to true
    const existingUser = await makeUserVerified(email);
    console.log("User has been verified");

    return sendResponse(res, 200, true, "User has been verified", { existingUser });
  } catch (error) {
    console.log("Error while verifying OTP: ", error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};
