import { Response } from "express";

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