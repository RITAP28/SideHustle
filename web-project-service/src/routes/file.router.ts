import express from 'express'
import { handleReadFiles } from '../controllers/files.service'
import { handleCreateBlankProject, handleGetProjects, handleReturnCWD } from '../controllers/projects.service';

export default (router: express.Router) => {
    router.get('/filetree', handleReadFiles);
    router.post('/createBlankProject', handleCreateBlankProject);
    router.get('/getprojects', handleGetProjects);
    router.get('/getcwd', handleReturnCWD);
}