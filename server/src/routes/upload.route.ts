import express from 'express';
import { handleUploadVideo } from '../controllers/upload.service';
import multer from 'multer';
import { storage } from '../middlewares/multer.upload';
import { isAuthenticated } from '../utils/auth.status';
import { getAllVideos } from '../controllers/video.controller';

const upload = multer({ storage: storage });

export default (router: express.Router) => {
    router.post('/upload', isAuthenticated, upload.fields([
        {
            name: "video",
            maxCount: 1
        },{
            name: "thumbnail",
            maxCount: 1
        }
    ]), handleUploadVideo);
    router.get('/getallvideos', getAllVideos);
};