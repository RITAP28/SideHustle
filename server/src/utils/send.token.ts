import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Response } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const sendToken = async (user: User, statusCode: number, res: Response) => {
  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.TOKEN_SECRET_KEY as string
  );
  console.log(token);

  const options = {
    expires: new Date(
        Date.now() + (Number(process.env.COOKIE_EXPIRE)) * 24 * 60 * 60 * 1000 
    ),
    httpOnly: true,
    secure: false,
    sameSite: true
  };

  try {
    const loggedInUser = await prisma.user.findUnique({
      where: {
        email: user?.email
      }
    });

    await prisma.session.create({
      data: {
        id: Math.random().toString(),
        userId: loggedInUser?.id as string,
        expiresAt: options.expires
      }
    });
    console.log(loggedInUser?.id);
  } catch (error) {
    console.log("Error while inserting a session into the database: ", error);
  }

  // res.cookie("token", token, options);

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token
  })
};