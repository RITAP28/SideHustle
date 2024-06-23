import { Request, Response } from "express";


export const handleCodeEditor = async (req: Request, res: Response) => {
    const { language, sourceCode } = req.body;
    if(!language || !sourceCode){
        return res.status(404).json({
            success: false,
            msg: "Enter all fields"
        });
    };
    try {
        
    } catch (error) {
        console.error("Error while processing the code: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
}