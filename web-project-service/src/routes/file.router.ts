import express from 'express'
import { handleReadFiles } from '../controllers/files.service'
import { handleCreateBlankProject, handleReturnCWD } from '../controllers/projects.service';
import { isAuthenticated } from '../utils/auth.status';

export default (router: express.Router) => {
    // test-route
    router.get('/getcwd', handleReturnCWD);

    // actual routes
    router.get('/filetree', handleReadFiles);
    
    // project routes
    router.post('/createBlankProject', handleCreateBlankProject);
}