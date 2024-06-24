import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendToken } from "../../utils/send.token";
import { sendEmail } from "../../utils/send.email";
import crypto from "crypto";

interface request extends Request {
    user: {
        userId: string;
    }
}

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

        // return sendToken(newUser, 200, res);

        await sendOTP(req, res, newUser.email);
        console.log("User registered initially...");

        return sendToken(newUser, 200, res);
    } catch (error) {
        console.error("Error while registering: ", error);
    };
};

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // generates a 6-digit OTP
}

export const sendOTP = async (req: Request, res: Response, email: string) => {
    if(!email){
        return res.status(400).json({
            success: false,
            msg: "Something went wrong!"
        })
    };

    const otp = generateOTP();
    console.log("OTP generated is: ", otp);

    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if(!existingUser){
        return res.status(404).json({
            success:false,
            msg: 'User not found'
        })
    };

    const id = Number(existingUser?.id);

    const newOTP = await prisma.oTP.create({
        data: {
            email: email,
            otp: hashedOtp,
            otpExpiresAt: otpExpiry,
            userId: id,
        }
    });
    console.log("new OTP has been generated");
    await sendEmail({
        to: email,
        subject: "OTP for verification",
        text: `your OTP is: ${otp}`
    });

    console.log("newOTP is: ", newOTP);
    console.log("OTP is sent to new user's email address")
};

export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } : {
        email: string;
        otp: string;
    } = req.body;
    if(!otp) {
        return res.status(400).json({
            success: false,
            msg: 'Enter the otp'
        })
    };
    try {
        const existingOTP = await prisma.oTP.findUnique({
            where: {
                email: email
            }
        });
    
        if(!existingOTP){
            return res.status(400).json({
                success: false,
                msg: 'user not found'
            })
        };

        const otpComparison = await bcrypt.compare(otp, existingOTP.otp);
    
        if((!otpComparison) || existingOTP.otpExpiresAt < new Date(Date.now())){
            return res.status(400).json({
                success: false,
                msg: 'Invalid OTP'
            })
        };
    
        // OTP is verified, so the otp is found in the database and deleted
        await prisma.oTP.delete({
            where: {
                email: email
            }
        });
        console.log("OTP has been deleted from the database");
    
        // the isVerified field of the user should turn to true
        const existingUser = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                isVerified: true
            }
        });
        console.log("User has been verified");
    
        return res.status(200).json({
            success: true,
            msg: 'OTP and user, both are verified',
            existingUser
        });
    } catch (error) {
        console.log("Error while verifying OTP: ", error);
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        })
    }
};