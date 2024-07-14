import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Video {
    videoId: number;
    title: string;
    link: string;
    dateOfPublishing: Date;
}

export const getAllVideos = async (req: Request, res: Response) => {
    try {
        const videos: Video[] = await prisma.videos.findMany();
        res.status(200).json(videos);
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
            return res.status(404).json({
                success: false,
                msg: "You have not starred this video"
            });
        };

        return res.status(200).json({
            success: true,
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

