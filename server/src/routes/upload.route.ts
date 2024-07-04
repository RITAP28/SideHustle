import express from 'express';
import multer from 'multer';
import { storage } from '../middlewares/multer.upload';
import { isAuthenticated } from '../utils/auth.status';
import { getAllVideos, handleGetCreatorInfo, handleGetOneVideo } from '../controllers/video.controller';
import { handleUploadVideo } from '../controllers/upload.service';
import { handleBecomeCreator, handleIsSubscribed, handleSubscribe } from '../controllers/user.controller';

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
    router.get('/videos', isAuthenticated, handleGetOneVideo);
    router.get('/getCreator', isAuthenticated, handleGetCreatorInfo);
    router.post('/rolecreator', isAuthenticated, handleBecomeCreator);
    router.post('/subscribe', isAuthenticated, handleSubscribe);
    router.get('/isSubscribed', isAuthenticated, handleIsSubscribed);
};