import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const handleGetUser = async (req: Request, res: Response) => {
    // const user = await prisma.user.findUnique({
    //     where: {
    //         name: {
    //             equals: req.params.name as string
    //         }
    //     }
    // })
    return 'hello';
}