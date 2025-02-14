import { prisma, Role } from "db";

export const getUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    })
};

export const updateUserToCreatorRole = async (id: number) => {
    return await prisma.user.update({
        where: {
            id: id
        },
        data: {
            role: Role.CREATOR
        }
    });
};

export const createCreator = async (id: number) => {
    const user = await getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return await prisma.creator.create({
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
};

export const getCreatorById = async (id: number) => {
    return await prisma.creator.findUnique({
        where: {
            userId: id
        }
    });
};

export const getSubscriptionById = async (id: number, creatorId: number) => { 
    return await prisma.subscriptions.findFirst({
        where: {
            userId: id,
            creatorUserId: creatorId
        }
    });
};

export const createSubscription = async (id: number, creatorId: number) => {
    const user = await getUserById(id);
    const creator = await getCreatorById(creatorId);
    return await prisma.subscriptions.create({
        data: {
            userId: user?.id as number,
            userName: user?.name as string,
            creatorUserId: creator?.userId as number,
            creatorName: creator?.creator as string
        }
    });
};

export const deleteSubscription = async (id: number, creatorId: number) => {
    return await prisma.subscriptions.delete({
        where: {
            userId_creatorUserId: {
                userId: id,
                creatorUserId: creatorId
            }
        }
    });
};

export const getUserFriends = async (id: number) => {
    return await prisma.user.findMany({
        where: {
            id: {
                not: id
            }
        }
    });
};

export const follow = async (userId: number, friendId: number) => {
    const user = await getUserById(userId);
    const friend = await getUserById(friendId);
    if (!user || !friend) {
        throw new Error("User not found");
    };
    return await prisma.follow.create({
        data: {
            followedId: friend.id,
            followedName: friend.name,
            followingId: user.id,
            followingName: user.name
        }
    });
};

export const existingFollow = async (userId: number, friendId: number) => {
    return await prisma.follow.findUnique({
        where: {
            followedId_followingId: {
                followedId: friendId,
                followingId: userId
            }
        }
    });
};

export const followingCount = async (id: number) => {
    return await prisma.follow.count({
        where: {
            followingId: id
        }
    })
}

export const followersCount = async (id: number) => {
    return await prisma.follow.count({
        where: {
            followedId: id
        }
    });
};