import { prisma } from "db";

export const findExistingUser = async (email: string) => {
    return await prisma.user.findFirst({
        where: {
            email: email
        }
    })
}