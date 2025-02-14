import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();
const userServiceBaseURL = process.env.USER_SERVICE_URL

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.post(`${userServiceBaseURL}/register`, req.body);
        
    } catch (error) {
        console.error("Error while accessing /register from the user service: ", error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "User server is unavailable. Please try again."
        });
    };
});