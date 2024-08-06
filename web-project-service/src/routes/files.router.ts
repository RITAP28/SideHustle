import express from 'express';
import { handleReadFiles } from '../controllers/files.service';

export default (router: express.Router) => {
    router.get('/filetree', handleReadFiles);
}