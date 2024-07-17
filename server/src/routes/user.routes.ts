import express from 'express';
import uploadRoutes from './upload.route';
import authRoutes from './auth.route';
import roomRoutes from './room.route';
import editorRoutes from './editor.routes';

const router = express.Router();

export default (): express.Router => {
    authRoutes(router);
    uploadRoutes(router);
    roomRoutes(router);
    editorRoutes(router);
    return router;
};