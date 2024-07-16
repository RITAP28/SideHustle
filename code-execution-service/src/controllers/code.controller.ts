import { Request, Response } from "express";

export const handleCodeExecuter = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error("Error while executing code: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    };
};