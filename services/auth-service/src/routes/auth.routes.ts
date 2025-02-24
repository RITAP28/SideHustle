// register route, login route and logout route
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { register } from '../controllers/register.controller';
import { login } from '../controllers/login.controller';
import { logout } from '../controllers/logout.controller';
import { verifyOTPMiddleware } from '../../middleware/otp.middleware';

dotenv.config();

const authRouter = express.Router();

authRouter.post("/register", async (req: Request, res: Response) => {
    await register(req, res)
});
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify", async (req: Request, res: Response) => {
    await verifyOTPMiddleware(req, res);
});

export default authRouter;