import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

interface User {
    email: string;
}

export const handleGetUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.query.id)
            }
        });
    
        if(!user) return res.status(404).json({
            success: false,
            msg: "Creator not found"
        });

        return res.status(200).json({
            success: true,
            msg: "User found",
            user
        });
    } catch (error) {
        console.error("Error while getting the user information: ", error);
        return res.status(404).json({
            success: false,
            msg: "User not found"
        })
    }
};

// function which gets called when a user uploads a video for the first time
export const handleBecomeCreator = async (req: Request, res: Response) => {
    const userId = Number(req.query.id);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) return res.status(404).json({
            success: false,
            msg: "User not found"
        });

        // update role to Creator
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: Role.CREATOR
            }
        });

        //update the Creator with details of the user
        const creator = await prisma.creator.create({
            data: {
                creator: user.name,
                displayName: "",
                subscribers: 0,
                views: 0,
                stars: 0,
                comments: 0,
                userId: user.id,
                userEmail: user.email
            }
        });
        console.log(creator);

        return res.status(200).json({
            success: true,
            msg: `user with email ${user.email} is now a creator!`,
            creator
        })
    } catch (error) {
        console.error("Error updating user to creator role: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    };
};

// function which gets called when the user clicks on the subscribe button on any creator page
export const handleSubscribe = async (req: Request, res: Response) => {
    try {
        // found the user
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.query.user)
            }
        });
        console.log(user);
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "Not Authenticated"
            })
        };
        // found the creator
        const creator = await prisma.creator.findUnique({
            where: {
                userId: Number(req.query.creator)
            }
        });
        console.log(creator);
        if(!creator){
            return res.status(404).json({
                success: false,
                msg: "Creator not found"
            })
        };

        // checking authentic subscription
        const existingSubscription = await prisma.subscriptions.findFirst({
            where: {
                userId: user.id
            }
        });

        if(existingSubscription){
            return res.status(400).json({
                success: false,
                msg: `Already subscribed to ${creator.creator}`
            })
        };

        // adding the creator to the subscriptions of the user
        const subscriptionAdded = await prisma.subscriptions.create({
            data: {
                userId: user.id,
                userName: user.name,
                creatorUserId: creator.userId,
                creatorName: creator.creator
            }
        });
        console.log("Subscription added: ", subscriptionAdded);

        return res.status(200).json({
            success: true,
            msg: `user ${user.name} has been added as a subscriber to the creator ${creator.creator}`
        });
        
    } catch (error) {
        console.error("Error subscribing: ", error);
        return res.status(500).json({
            success: false,
            msg: "Error subscribing"
        });
    }
};

// function which says whether the user is subscribed to that particular creator or not
export const handleIsSubscribed = async (req: Request, res: Response) => {
    const userId = Number(req.query.user);
    const creatorId = Number(req.query.creator);
    try {
        const existingSubscription = await prisma.subscriptions.findFirst({
            where: {
                userId: userId,
                creatorUserId: creatorId
            }
        });
        
        if(!existingSubscription){
            return res.json({
                success: false
            });
        };

        console.log("User is not subscribed yet");
        return res.json({
            success: true
        });
    } catch (error) {
        console.error("Error while checking if the user is subscribed: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    };
};

// function for user to unsubscribe
export const handleUnSubscribe = async (req: Request, res: Response) => {
    const userId = Number(req.query.user);
    const creatorId = Number(req.query.creator);
    try {
        if(await handleIsSubscribed(req, res)){
            await prisma.subscriptions.delete({
                where: {
                    userId_creatorUserId: {
                        userId: userId,
                        creatorUserId: creatorId
                    }
                }
            });
            return res.status(200).json({
                success: true,
                msg: `User with ${userId} has unsubscribed from the channel with creator ${creatorId}`
            });
        };
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error unsubscribing...'
        });
    };
};

export const handleGetFriends = async (req: Request, res: Response) => {
    const userId = Number(req.query.id);
    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: userId
                }
            }
        });

        if(!users){
            return res.status(404).json({
                success: false,
                msg: "Users not found"
            });
        };

        return res.status(200).json({
            success: true,
            msg: "All users found",
            users
        });
    } catch (error) {
        console.error("Error while fetching all your friends: ", error);
        return res.status(500).json({
            success: false,
            msg: "Something is wrong in the backend code"
        });
    };
};

export const handleGetFriend = async (req: Request, res: Response) => {
    const username = String(req.query.name);
    const userId = Number(req.query.id);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            })
        };
        return res.status(200).json({
            success: true,
            msg: "user found",
            user
        });
    } catch (error) {
        console.error("Error while fetching friend: ", error);
        return res.status(404).json({
            success: false,
            msg: "Something went wrong"
        });
    };
};

export const handleFollow = async (req: Request, res: Response) => {
    const friendId = Number(req.query.id);
    const userId = Number(req.body.id);
    try {
        const friend = await prisma.user.findUnique({
            where: {
                id: friendId
            }
        });
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if(!user || !friend){
            return res.status(404).json({
                success: false,
                msg: "User or friend not found"
            })
        };

        // adding both friend and user to the follower database
        const followerAdded = await prisma.follow.create({
            data: {
                followedId: friend.id,
                followedName: friend.name,
                followingId: user.id,
                followingName: user.name
            }
        });
        console.log(`You, ${user.name} are following ${friend.name}`);
        return res.status(200).json({
            success: true,
            msg: `User ${user.name} is following ${friend.name}`,
            followerAdded,
            friend: friend,
            user: user
        });
    } catch (error) {
        console.error("Error while following friend: ", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong while following"
        })
    };
};

export const handleIsFollowed = async (req: Request, res: Response) => {
    const followedId = Number(req.query.id);
    const followingId = Number(req.body.id);
    try {
        const existingFollowing = await prisma.follow.findUnique({
            where: {
                followedId_followingId: {
                    followedId: followedId,
                    followingId: followingId
                }
            }
        });
        if(!existingFollowing){
            console.log("No existing following");
            return false;
        }
        console.log("true");
        return res.status(200).json({
            success: true,
            msg: "User is already following this friend"
        });
    } catch (error) {
        console.error("Error while checking is-followed: ", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong"
        });
    };
};

export const handleCountFollowers = async (req: Request, res: Response) => {
    const userId = Number(req.query.id);
    try {
        const currentUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if(!currentUser) return res.status(404).json({
            success: false,
            msg: "User not found"
        });
        const followingCount = await prisma.follow.count({
            where: {
                followingId: currentUser.id
            }
        });
        const followersCount = await prisma.follow.count({
            where: {
                followedId: currentUser.id
            }
        });
        return res.status(200).json({
            success: true,
            msg: `${currentUser.name}'s following and followers counted`,
            followers: followersCount,
            following: followingCount
        });
    } catch (error) {
        console.error("Error while counting followers: ", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong"
        });
    };
};