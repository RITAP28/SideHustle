import express from 'express';
import { handleUploadVideo } from '../controllers/upload.service';
import multer from 'multer';
import { storage } from '../middlewares/multer.upload';
import { isAuthenticated } from '../utils/auth.status';
import { getAllVideos } from '../controllers/video.controller';

const upload = multer({ storage: storage });

export default (router: express.Router) => {
    router.post('/pages/upload', isAuthenticated, upload.single('file'), handleUploadVideo);
    router.get('/getallvideos', getAllVideos);
};