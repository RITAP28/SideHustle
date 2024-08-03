import express from 'express';
import { isAuthenticated } from '../utils/auth.status';
import { handleCreateNewFile, handleGetAllFiles, handleGetSpecificFile, handleRunCode, handleUpdateContent } from '../controllers/editor.controller';

export default (router: express.Router) => {
    router.post('/createnewfile', isAuthenticated, handleCreateNewFile);
    router.put("/run", isAuthenticated, handleRunCode);
    router.get('/getallfiles', isAuthenticated, handleGetAllFiles);
    router.get('/getfile', isAuthenticated, handleGetSpecificFile);
    router.put('/updatefile', isAuthenticated, handleUpdateContent);
}