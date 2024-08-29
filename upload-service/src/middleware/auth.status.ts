import { prisma } from 'db';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface Decoded extends JwtPayload {
    email: string;
};

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        name: string;
    }
};

export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if(!token){
        return res.status(401).json({
            success: false,
            msg: "Not Authorised, No token found"
        });
    };

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string) as Decoded;
        
        const existingUser = await prisma.user.findUnique({
            where: {
                email: decodedToken.email
            }
        });

        if(!existingUser){
            return res.status(401).json({
                success: false,
                msg: "No User found"
            })
        };

        req.user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: "Invalid token"
        });
    };
};