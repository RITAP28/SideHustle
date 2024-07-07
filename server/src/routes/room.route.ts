import express from 'express';
import { isAuthenticated } from '../utils/auth.status';
import { handleGetIndividualRoom, handleGetRandomRooms, handleMakeRoom } from '../controllers/room.controller';

export default (router: express.Router) => {
    router.post('/makeRoom', isAuthenticated, handleMakeRoom);
    router.get('/getRandomRooms', isAuthenticated, handleGetRandomRooms);
    router.get('/getIndividualRoom', isAuthenticated, handleGetIndividualRoom);
}