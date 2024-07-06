import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

export const handleGetUser = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(req.query.id)
        }
    });

    if(!user) return res.status(404).json({
        success: false,
        msg: "Creator not found"
    });
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