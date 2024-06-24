import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendToken } from "../../utils/send.token";


export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if(!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            msg: "Enter all fields"
        })
    }

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
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        return sendToken(newUser, 200, res);

    } catch (error) {
        console.error("Error while registering: ", error);
    };

}