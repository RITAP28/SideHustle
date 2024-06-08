import express from 'express';
import uploadRoutes from './upload.route';
import authRoutes from './auth.routes';

const router = express.Router();

export default (): express.Router => {
    authRoutes(router);
    uploadRoutes(router);
    return router;
};