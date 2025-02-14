import { Request, Response } from "express";

export const handleGetUser = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error("Error while fetching user: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
}