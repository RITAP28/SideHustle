import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllVideos = async (req: Request, res: Response) => {
    try {
        const videos = await prisma.videos.findMany();
        return res.status(200).json({
            success: true,
            msg: 'all videos found'
        });
    } catch (err) {
        console.error("Error getting all videos for home page: ", err);
        return res.status(400).json({
            success: false,
            msg: 'videos not found'
        });
    };
};

const getSingleVideo = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.log("Error fetching this specific video: ", error);
        return res.status(400).json({
            success: false,
            msg: 'this video not found'
        });
    };
};