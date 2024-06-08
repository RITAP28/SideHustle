import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface decoded {
    username: string;
    iat: number;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if(!token){
        return res.status(401).json({
            success: false,
            msg: "Not Authorised"
        });
    };

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string);
    console.log("decodedToken: ", decodedToken);

    res.status(200).json({
        success: true,
        msg: "Authenticated"
    });

    next();
}