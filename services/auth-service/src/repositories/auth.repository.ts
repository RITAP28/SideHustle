import { prisma } from "db";

export const findExistingUser = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })
};