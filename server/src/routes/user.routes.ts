import express from 'express';
import uploadRoutes from './upload.route';

const router = express.Router();

export default (): express.Router => {
    uploadRoutes(router);
    return router;
};