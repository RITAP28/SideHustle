import express from 'express'
import { handleReadFiles } from '../controllers/files.service'
import { handleReturnCWD } from '../controllers/projects.service';

export default (router: express.Router) => {
    // test-route
    router.get('/getcwd', handleReturnCWD);

    // actual routes
    router.get('/filetree', handleReadFiles);   
}