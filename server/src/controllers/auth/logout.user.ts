import { Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
    
        res.status(200).json({
            success: true,
            msg: "Logged out sucessfully"
        });

    } catch (error) {
        console.error("Error while logging out: ", error);
    };
};