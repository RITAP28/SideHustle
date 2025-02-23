// register route, login route and logout route
import express from 'express';
import dotenv from 'dotenv';
import { register } from '../controllers/register.controller';
import { login } from '../controllers/login.controller';

dotenv.config();

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;