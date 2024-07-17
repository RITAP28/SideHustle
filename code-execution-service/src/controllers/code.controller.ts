import { Request, Response } from "express";
import fs from "fs";

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

export const handleFileCreator = async (req: Request, res: Response) => {
    try {
        const { template, fileName } : {
            template: string,
            fileName: string
        } = req.body;
        if(!template || !fileName){
            return res.status(404).json({
                success: false,
                msg: "Both fields are required"
            });
        };
        const fileCreated = fs.createWriteStream(fileName);
        fileCreated.end();
        return res.status(200).json({
            success: false,
            msg: "File created successfully"
        });
    } catch (error) {
        console.error("Error while creating a file: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    };
}