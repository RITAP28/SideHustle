import { PrismaClient } from "@prisma/client";
export * from './types';

const prisma = new PrismaClient();

export { prisma };