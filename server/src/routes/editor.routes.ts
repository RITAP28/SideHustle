import express from 'express';
import { isAuthenticated } from '../utils/auth.status';
import { handleCreateNewFile, handleGetAllFiles, handleGetSpecificFile } from '../controllers/editor.controller';

export default (router: express.Router) => {
    router.post('/createnewfile', isAuthenticated, handleCreateNewFile);
    router.get('/getallfiles', isAuthenticated, handleGetAllFiles);
    router.get('/getfile', isAuthenticated, handleGetSpecificFile);
}