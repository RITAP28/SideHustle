import { Request, Response } from "express";
import { createCreator, createSubscription, deleteSubscription, existingFollow, follow, followersCount, followingCount, getCreatorById, getSubscriptionById, getUserById, getUserFriends, updateUserToCreatorRole } from "../services/user.service";

export const handleGetUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        };
        return res.status(200).json({
            status: 200,
            success: true,
            message: "User found successfully",
            user: user
        });
    } catch (error) {
        console.error("Error while fetching user: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
}

export const handleBecomeCreator = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        };
        // update the user to become a creator
        await updateUserToCreatorRole(user.id);
        const creator = await createCreator(user.id);
        if (!creator) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Error creating creator profile"
            });
        }
        console.log("creator created: ", creator);
        return res.status(200).json({
            status: 200,
            success: true,
            message: `User, ${user.name}, updated successfully to become role ${user.role}`,
            creator: creator
        });
    } catch (error) {
        console.error("Error while updating user to creator role: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleSubscribe = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const creatorId = Number(req.params.cId);
    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        };
        const creator = await getCreatorById(creatorId);
        if (!creator) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Creator not found"
            });
        };
        const existingSubscription = await getSubscriptionById(userId, creatorId);
        if (existingSubscription) {
            console.log("subscription already exists");
        };
        const subscriptionAdded = await createSubscription(userId, creatorId);
        console.log("subscription added: ", subscriptionAdded);
        return res.status(200).json({
            status: 200,
            success: true,
            message: `User, ${user.name}, has subscribed to a creator, ${creator.creator}`,
            newSubscription: subscriptionAdded
        });
    } catch (error) {
        console.error("Error while subscribing to a channel: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};

export const handleIsSubscribed = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const creatorId = Number(req.params.cId);
    try {
        const existingSubscription = await getSubscriptionById(userId, creatorId);
        if (!existingSubscription) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User is not subscribed to the creator"
            });
        };
        return res.status(200).json({
            status: 200,
            success: true,
            message: `User ${userId} is subscribed to the creator ${creatorId}`,
            subscription: existingSubscription
        });
    } catch (error) {
        console.error("Error while checking is subscribed or not: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};

export const handleUnSubscribe = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const creatorId = Number(req.params.creatorId);
    try {
        const existingSubscription = await getSubscriptionById(userId, creatorId);
        if (!existingSubscription) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `User ${userId} is not currently subscribed to the creator ${creatorId}`
            });
        };
        await deleteSubscription(userId, creatorId);
        return res.status(200).json({
            status: 200,
            success: true,
            message: `User ${userId} has unsubscribed from the creator ${creatorId}`,
        });
    } catch (error) {
        console.error("Error while unsubscribing from the creator: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};

export const handleGetFriends = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    try {
        const otherUsers = await getUserFriends(userId);
        if (!otherUsers) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No other users except ${userId} found`
            });
        };
        return res.status(200).json({
            status: 200,
            success: true,
            message: `Users except ${userId} found successfully`,
            users: otherUsers
        });
    } catch (error) {
        console.error("Error while fetching your friends: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};

export const handleFollow = async (req: Request, res: Response) => {
    const friendId = Number(req.params.friendId);
    const userId = Number(req.params.id);
    try {
        const addFollow = await follow(userId, friendId);
        console.log(`User ${userId} follows friend ${friendId} successfully`);
        return res.status(200).json({
            status: 200,
            success: true,
            message: `User ${userId} follows friend ${friendId}`,
            follow: addFollow
        });
    } catch (error) {
        console.error("Error while following friend: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};

export const isFollowed = async (req: Request, res: Response) => {
    const followedId = Number(req.params.followedId);
    const followingId = Number(req.params.followingId);
    try {
        const existingFollowing = await existingFollow(followingId, followedId);
        if (!existingFollowing) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `User ${followingId} is not following friend ${followedId}`
            });
        };
        return res.status(200).json({
            status: 200,
            success: true,
            message: `User ${followingId} is following friend ${followedId}`,
            following: existingFollowing
        });
    } catch (error) {
        console.error("Error while checking is followed or not: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};

export const handleCountFollowers = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    try {
        const currentUser = await getUserById(userId);
        if (!currentUser) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        };
        const followingNumbers = await followingCount(currentUser.id);
        const followerNumbers = await followersCount(currentUser.id);
        return res.status(200).json({
            status: 200,
            success: true,
            message: `User ${userId} has ${followingNumbers} followings and ${followerNumbers} followers`,
            followings: followingNumbers,
            followers: followerNumbers
        });
    } catch (error) {
        console.error("Error while counting followers: ", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    };
};