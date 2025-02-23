import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { INodemailerOptions } from "./interface";

export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: Record<string, any> = {}
) => {
  res.status(status).json({
    status: status,
    success: success,
    message: message,
    ...data
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
