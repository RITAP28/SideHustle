import express from 'express';
import multer from 'multer';
import { storage } from '../middlewares/multer.upload';
import { isAuthenticated } from '../utils/auth.status';
import { getAllVideos, handleGetAllReviewsByVideosId, handleGetAllStarsByVideoId, handleGetCreatorInfo, handleGetOneVideo, handleIsStarred, handleReviewVideo, handleStarVideo } from '../controllers/video.controller';
import { handleUploadVideo } from '../controllers/upload.service';
import { handleBecomeCreator, handleCountFollowers, handleFollow, handleGetFriend, handleGetFriends, handleGetUser, handleIsFollowed, handleIsSubscribed, handleSubscribe } from '../controllers/user.controller';

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
    router.get('/getuser', isAuthenticated, handleGetUser);
    router.get('/videos', isAuthenticated, handleGetOneVideo);
    router.get('/getCreator', isAuthenticated, handleGetCreatorInfo);
    router.post('/rolecreator', isAuthenticated, handleBecomeCreator);
    router.post('/subscribe', isAuthenticated, handleSubscribe);
    router.get('/isSubscribed', isAuthenticated, handleIsSubscribed);
    router.get('/getallfriends', isAuthenticated, handleGetFriends);
    router.get('/getfriend', isAuthenticated, handleGetFriend);
    router.post('/follow', isAuthenticated, handleFollow);
    router.post('/isFollowed', isAuthenticated, handleIsFollowed);
    router.get('/followCount', isAuthenticated, handleCountFollowers);
    router.post('/submitReview', isAuthenticated, handleReviewVideo);
    router.get('/getAllReviews', isAuthenticated, handleGetAllReviewsByVideosId);
    router.post('/starAVideo', isAuthenticated, handleStarVideo);
    router.get('/getAllStars', isAuthenticated, handleGetAllStarsByVideoId);
    router.get('/isStarred', isAuthenticated, handleIsStarred);
};