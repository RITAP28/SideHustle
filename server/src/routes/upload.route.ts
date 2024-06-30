import express from 'express';
// import { handleUploadVideo } from '../controllers/upload.service';
import multer from 'multer';
import { storage } from '../middlewares/multer.upload';
import { isAuthenticated } from '../utils/auth.status';
import { handleGetOneVideo } from '../controllers/video.controller';
// import { handleUploadVideos } from '../controllers/services/upload.service';
import { getAllVideos } from '../controllers/services/watch.service';
import { handleUploadVideo } from '../controllers/upload.service';

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
    // router.post('/upload', isAuthenticated, upload.fields([
    //     {
    //         name: "video",
    //         maxCount: 1
    //     },{
    //         name: "thumbnail",
    //         maxCount: 1
    //     }
    // ]), handleUploadVideos);
    router.get('/getallvideos', getAllVideos);
    router.get('/videos', isAuthenticated, handleGetOneVideo);
};