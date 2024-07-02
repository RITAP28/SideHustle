import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
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

}