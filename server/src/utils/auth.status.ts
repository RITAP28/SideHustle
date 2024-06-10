import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Decoded extends JwtPayload {
    userId: string;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if(!token){
        return res.status(401).json({
            success: false,
            msg: "Not Authorised"
        });
    };

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string) as Decoded;
        
        const existingUser = await prisma.user.findUnique({
            where: {
                id: decodedToken.userId
            }
        });

        if(existingUser){
            next();
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: "Invalid token"
        })
    }

    // next();
}