import express from 'express';
import fileRoutes from './files.router';

const router = express.Router();

export default (): express.Router => {
    fileRoutes(router);
    return router;
}