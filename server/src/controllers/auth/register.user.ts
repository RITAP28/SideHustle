import { PrismaClient } from "@prisma/client";
import { uuid } from "uuidv4"
const prisma = new PrismaClient();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendToken } from "../../utils/send.token";


export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const userId = uuid();

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                name: name as string,
                email: email as string,
            }
        });
    
        if(existingUser){
            return res.status(400).json({
                msg: "User already exists"
            })
        };
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await prisma.user.create({
            data: {
                id: userId,
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        sendToken(newUser, 200, res);

        res.status(200).json({
            msg: "User registered successfully",
            newUser
        });

    } catch (error) {
        console.error("Error while registering: ", error);
    }
}