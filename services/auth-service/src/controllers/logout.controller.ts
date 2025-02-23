import { Request, Response } from "express";

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
       res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
       });
       res.status(200).json({
        status: 200,
        success: true,
        message: "Logged out successfully"
       });
    } catch (error) {
        console.error("Error while logging out: ", error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};