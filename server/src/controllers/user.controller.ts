import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

export const handleGetUser = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(req.query.id)
        }
    });

    if(!user) return res.status(404).json({
        success: false,
        msg: "Creator not found"
    });
};

export const handleBecomeCreator = async (req: Request, res: Response) => {
    const userId = Number(req.query.id);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) return res.status(404).json({
            success: false,
            msg: "User not found"
        });

        // update role to Creator
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: Role.CREATOR
            }
        });

        //update the Creator with details of the user
        const creator = await prisma.creator.create({
            data: {
                creator: user.name,
                displayName: "",
                subscribers: 0,
                views: 0,
                stars: 0,
                comments: 0,
                userId: user.id,
                userEmail: user.email
            }
        });
        console.log(creator);

        return res.status(200).json({
            success: true,
            msg: `user with email ${user.email} is now a creator!`,
            creator
        })
    } catch (error) {
        console.error("Error updating user to creator role: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    };
};