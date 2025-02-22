import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { INodemailerOptions, IUserProps } from "./interface";
import { prisma } from "db";

export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string
) => {
  res.status(status).json({
    status: status,
    success: success,
    message: message,
  });
};

export const sendEmail = async (options: INodemailerOptions) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
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
    };
    return existingUser;
  } catch (error) {
    console.error("Error fetching existing user: ", error);
    return sendResponse(res, 500, false, "Database Error");
  }
};
