import { Request, Response } from "express";

export const handleBlankProject = async (req :Request, res: Response) => {
    try {
        const { projectName, userId, userName } = req.body;
        
    } catch (error) {
        console.error("Error while creating a blank project: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};