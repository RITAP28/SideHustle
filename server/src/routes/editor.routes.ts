import express from 'express';
import { isAuthenticated } from '../utils/auth.status';
import { handleCreateNewFile } from '../controllers/editor.controller';

export default (router: express.Router) => {
    router.post('/createnewfile', isAuthenticated, handleCreateNewFile);
}