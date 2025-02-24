import { IUserProps } from "../src/utils/interface";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { sendResponse } from "../src/utils/utils";
import dotenv from 'dotenv'
import {
  createSession,
  findExistingUser,
} from "../src/repositories/auth.repository";

dotenv.config();

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
    const loggedInUser = await findExistingUser(user.email);
    if (!loggedInUser) {
      console.log("User not found in the database");
      return sendResponse(res, 404, false, "User not found");
    }
    await createSession(loggedInUser?.id as number, options.expires);
    res.cookie("token", token, options);
  } catch (error) {
    console.log("Error while inserting a session into the database: ", error);
    return sendResponse(
      res,
      500,
      false,
      "Error while inserting session into the database"
    );
  }
};
