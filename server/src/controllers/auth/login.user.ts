import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendToken } from "../../utils/send.token";
const prisma = new PrismaClient();

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({
            msg: "Enter all fields"
        });
    };

    const existingUser = await prisma.user.findFirst({
        where: {
            email: email as string
        }
    });

    if(!existingUser){
        return res.status(401).json({
            msg: "User not found"
        });
    };

    try {
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if(!validPassword){
            return res.status(401).json({
                msg: "Invalid Credentials"
            });
        };
    } catch (error) {
        console.error("Error while logging in: ", error);
    };

    sendToken(existingUser, 200, res);
    console.log("Logged in successfully!");
    
};