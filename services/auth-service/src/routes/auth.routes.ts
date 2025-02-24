// register route, login route and logout route
import express from 'express';
import dotenv from 'dotenv';
import { register } from '../controllers/register.controller';
import { login } from '../controllers/login.controller';
import { logout } from '../controllers/logout.controller';

dotenv.config();

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;