import express from 'express';
import uploadRouter from './upload.route';

const router = express.Router();

export default (): express.Router => {
    uploadRouter(router);
    return router;
};