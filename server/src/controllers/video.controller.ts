import { Request, Response } from "express";
import { redisClient } from "../server";
import { prisma } from "db";

interface Video {
    videoId: number;
    title: string;
    link: string;
    dateOfPublishing: Date;
}

export const getAllVideos = async (req: Request, res: Response) => {
    let allVideos: Array<Video> = [];
    let isCached = false;
    const cacheKey = 'allvideos';
    try {
        const cachedVideos = await redisClient.get(cacheKey);
        if(cachedVideos){
            isCached = true;
            allVideos = JSON.parse(cachedVideos);
            console.log('all videos obtained from redis successfully');
            res.status(200).json(allVideos);
        } else {
            const videos: Video[] = await prisma.videos.findMany();
            console.log('database queried');
            await redisClient.set(cacheKey, JSON.stringify(videos), {
                EX: 60,
                NX: true
            });
            console.log('data set into redis');
            res.status(200).json(videos);
        }
    } catch (error) {
        console.error("Error while fetching videos: ", error);
        res.status(500).json({
            success: false,
            msg: 'Error while fetching videos'
        });
    };
};

export const handleGetOneVideo = async (req: Request, res: Response) => {
    try {
        const videoId = Number(req.query.videoId);
        if(isNaN(videoId)){
            return res.status(400).json({
                success: false,
                msg: "Invalid video ID"
            })
        };
        const video = await prisma.videos.findUnique({
            where: {
                videoId: videoId
            }
        });
        if(!videoId){
            return res.status(404).json({
                success: false,
                msg: "Video not found"
            })
        };

        res.status(200).json({
            success: true,
            video
        });
    } catch (error) {
        console.error("Error while fetching video: ", error);
        res.status(500).json({
            success: false,
            msg: "Error while fetching video"
        });
    };
};

export const handleGetCreatorInfo = async (req: Request, res: Response) => {
    try {
        const creatorId = Number(req.query.creator);
        console.log(creatorId);
        if(isNaN(creatorId)){
            return res.status(400).json({
                success: false,
                msg: "Invalid creator ID"
            });
        };

        const creator = await prisma.creator.findUnique({
            where: {
                userId: creatorId
            }
        });
        console.log(creator);
        return res.status(200).json({
            success: true,
            msg: "Creator found",
            creatorName: creator?.creator as string,
            creatorEmail: creator?.userEmail as string
        });
    } catch (error) {
        console.error("Error while fetching the name of the creator: ", error);
        return res.status(404).json({
            success: false,
            msg: "Creator not found"
        });
    };
};

export const handleReviewVideo = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.user);
        const creatorId = Number(req.query.creator);
        const videoId = Number(req.query.videoId);

        const { reviewText } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        const creator = await prisma.creator.findUnique({
            where: {
                userId: creatorId
            }
        });

        const video = await prisma.videos.findUnique({
            where: {
                videoId: videoId
            }
        });

        if(!user || !creator || !video){
            return res.status(404).json({
                success: false,
                msg: "User/Creator/Video not found"
            })
        };

        const review = await prisma.review.create({
            data: {
                videoId: videoId,
                reviewerId: userId,
                reviewerName: user.name,
                creatorId: creatorId,
                reviewText: reviewText as string,
            }
        });

        console.log(review);
        return res.status(200).json({
            success: true,
            msg: "Review Submitted successfully",
            review
        });
    } catch (error) {
        console.error("Error while reviewing video: ", error);
        return res.status(500).json({
            success: false,
            msg: 'Error while reviewing video'
        });
    };
};

export const handleGetAllReviewsByVideosId = async (req: Request, res: Response) => {
    try {
        const videoId = Number(req.query.videoId);

        const reviewsByVideoId = await prisma.review.findMany({
            where: {
                videoId: videoId
            }
        });
        console.log(reviewsByVideoId);
        
        return res.status(200).json({
            success: true,
            msg: `Reviews found of video with id ${videoId}`,
            reviewsByVideoId
        });

    } catch (error) {
        console.error("Error while getting video's review: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleStarVideo = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.user);
        const videoId = Number(req.query.videoId);
        const creatorId = Number(req.query.creator);

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        const video = await prisma.videos.findUnique({
            where: {
                videoId: videoId
            }
        });

        const creator = await prisma.creator.findUnique({
            where: {
                userId: creatorId
            }
        });

        if(!user || !video || !creator){
            return res.status(404).json({
                success: false,
                msg: "User/Video/Creator not found"
            })
        };

        const isStarred = await prisma.starVideo.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });
        if(isStarred){
            return res.status(400).json({
                success: false,
                msg: "You have already starred this video"
            });
        };

        const isDisliked = await prisma.dislikeVideo.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });

        if(isDisliked){
            await prisma.dislikeVideo.delete({
                where: {
                    userId_videoId: {
                        userId,
                        videoId
                    }
                }
            });
        };

        await prisma.starVideo.create({
            data: {
                userId: userId,
                videoId: videoId,
                creatorId: creatorId
            }
        });

        return res.status(200).json({
            success: true,
            msg: `user with id ${userId} starred video ${videoId} of creator with id ${creatorId}`
        });
    } catch (error) {
        console.error("Error while liking video: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleGetAllStarsByVideoId = async (req: Request, res: Response) => {
    try {
        const videoId = Number(req.query.videoId);
        const video = await prisma.videos.findUnique({
            where: {
                videoId: videoId
            }
        });

        if(!video){
            return res.status(404).json({
                success: false,
                msg: "Video not found"
            });
        };

        const starsbyVideoId = await prisma.starVideo.findMany({
            where: {
                videoId: videoId
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Stars found successfully",
            starsbyVideoId
        });
    } catch (error) {
        console.error("Error while fetching stars for this video: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleIsStarred = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.user);
        const videoId = Number(req.query.videoId);

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        const video = await prisma.videos.findUnique({
            where: {
                videoId: videoId
            }
        });

        if(!user || !video){
            return res.status(404).json({
                success: false,
                msg: "User/Video not found"
            });
        };

        const isStarred = await prisma.starVideo.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });

        if(!isStarred){
            return res.json({
                success: true,
                isStar: false,
                msg: "You have not starred this video"
            });
        };

        return res.status(200).json({
            success: true,
            isStar: true,
            msg: "You have already starred this video"
        });
    } catch (error) {
        console.error("Error while checking whether this video is starred or not: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleRemoveStar = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.user);
        const videoId = Number(req.query.videoId);

        const star = await prisma.starVideo.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });
        if(!star){
            return res.status(404).json({
                success: false,
                msg: "Star not found"
            })
        };
        await prisma.starVideo.delete({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });
        return res.status(200).json({
            success: true,
            msg: `user with id ${userId} removed star from video ${videoId}`
        });
    } catch (error) {
        console.error("Error while removing star: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleGetAllSubscribers = async (req: Request, res: Response) => {
    try {
        const creatorId = Number(req.query.creator);
        const creator = await prisma.creator.findUnique({
            where: {
                userId: creatorId
            }
        });
        if(!creator){
            return res.status(404).json({
                success: false,
                msg: "Creator/Channel not found"
            })
        };
        const subscribers = await prisma.subscriptions.findMany({
            where: {
                creatorUserId: creatorId
            }
        });
        if(!subscribers){
            return res.status(404).json({
                success: false,
                msg: "subscribers not found"
            });
        };
        return res.status(200).json({
            success: true,
            msg: "Subscribers found successfully",
            subscribers
        });
    } catch (error) {
        console.error("Error while getting all subscribers: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleDislikeVideo = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.user);
        const videoId = Number(req.query.videoId);
        const creatorId = Number(req.query.creator);

        const starredVideo = await prisma.starVideo.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });

        if(starredVideo){
            await prisma.starVideo.delete({
                where: {
                    userId_videoId: {
                        userId,
                        videoId
                    }
                }
            });
        }

        await prisma.dislikeVideo.create({
            data: {
                userId: userId,
                videoId: videoId,
                creatorId: creatorId
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Disliked video successfully"
        });
    } catch (error) {
        console.error("Error while disliking video: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleIsDisliked = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.user);
        const videoId = Number(req.query.videoId);

        const isDisliked = await prisma.dislikeVideo.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });

        if(isDisliked){
            return res.json({
                success: true,
                disliked: true,
                msg: "This video is already disliked by you"
            })
        } else {
            return res.json({
                success: true,
                disliked: false,
                msg: "This video is not disliked by you"
            })
        };
    } catch (error) {
        console.error("Error while checking isDisliked: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};

export const handleRemoveDislike = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.user);
        const videoId = Number(req.query.videoId);

        await prisma.dislikeVideo.delete({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Dislike removed successfully"
        });
    } catch (error) {
        console.error("Error while removing dislike: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    };
};