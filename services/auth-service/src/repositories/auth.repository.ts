import { prisma } from "db";
import { sendResponse } from "../utils/utils";
import { Request, Response } from "express";

export const findExistingUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const getExistingUser = async (
  req: Request,
  res: Response,
  email: string
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return sendResponse(res, 404, false, "User not found");
    }
    return existingUser;
  } catch (error) {
    console.error("Error fetching existing user: ", error);
    return sendResponse(res, 500, false, "Database Error");
  }
};

export const createOTP = async (
  req: Request,
  res: Response,
  email: string,
  otp: string,
  otpExpiresAt: Date,
  userId: number
) => {
  return await prisma.oTP.create({
    data: {
      email: email,
      otp: otp,
      otpExpiresAt: otpExpiresAt,
      userId: userId,
    },
  });
};

export const getExistingOTP = async (email: string) => {
    return await prisma.oTP.findUnique({
        where: {
            email: email
        }
    });
};

export const deleteOTP = async (email: string): Promise<void> => {
    await prisma.oTP.delete({
        where: {
            email: email
        }
    })
}

export const makeUserVerified = async (email: string) => {
    return await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          isVerified: true,
        },
      });
}

export const createSession = async (userId: number, expiresAt: Date): Promise<void> => {
    await prisma.session.create({
        data: {
            userId: userId,
            expiresAt: expiresAt
        }
    })
}