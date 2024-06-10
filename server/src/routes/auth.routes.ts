import express from 'express';
import { registerUser } from '../controllers/auth/register.user';
import { loginUser } from '../controllers/auth/login.user';
import { logoutUser } from '../controllers/auth/logout.user';

export default (router: express.Router) => {
    router.post('/register', registerUser);
    router.post('/login', loginUser);
    router.post('/logout', logoutUser);
};