import { IUserProps } from "../src/utils/interface";
import jwt from "jsonwebtoken";
import { prisma } from "db";
import { Response } from "express";
import { sendResponse } from "../src/utils/utils";

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY as string;
const COOKIE_EXPIRE = process.env.COOKIE_EXPIRE;

export const sendToken = async (
  user: IUserProps,
  statusCode: number,
  res: Response
) => {
  const token = jwt.sign(
    {
      email: user.email,
    },
    TOKEN_SECRET_KEY as string
  );
  console.log("token generated: ", token);

  const options = {
    expires: new Date(Date.now() + Number(COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
    sameSite: true,
  };

  // DB query to create a session in the database
  try {
    const loggedInUser = await prisma.user.findUnique({
      where: {
        email: user?.email,
      },
    });

    await prisma.session.create({
      data: {
        userId: loggedInUser?.id as number,
        expiresAt: options.expires,
      },
    });
  } catch (error) {
    console.log("Error while inserting a session into the database: ", error);
    return sendResponse(
      res,
      500,
      false,
      "Error while inserting session into the database"
    );
  }

  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
