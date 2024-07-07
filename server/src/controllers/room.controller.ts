import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const generateUniqueRoomId = (roomlink: string) => {
    return bcrypt.hash(roomlink, 10);
};

export const handleMakeRoom = async (req: Request, res: Response) => {
    const { roomName, maxMembers, leader, leaderId } : {
        roomName: string;
        maxMembers: number;
        leader: string;
        leaderId: number;
    } = req.body;
    try {
        const main = `room-${Math.random().toString(36).substring(2,9)}-${roomName}-${maxMembers}`;
        const roomId = generateUniqueRoomId(main);
        const link = `http://localhost:5173/room?name=${roomName}&roomId=${roomId}`;

        const roomCreated = await prisma.room.create({
            data: {
                roomlink: link,
                roomName: roomName,
                leader: leader,
                leaderId: leaderId,
                invitedMembers: maxMembers
            }
        });

        return res.status(200).json({
            success: false,
            msg: `Room created successfully with ${leader} as the captain`,
            roomCreated
        });
    } catch (error) {
        console.error("Error while making the room: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    };
};