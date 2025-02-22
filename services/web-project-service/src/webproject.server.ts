import express from 'express';
import {WebSocket, WebSocketServer} from 'ws';
import * as pty from 'node-pty';
import cookieParser from 'cookie-parser';
import router from './routes/router';
import cors from 'cors';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';

const PORT = 8082;

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/', router());
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
export const wss = new WebSocketServer({
    server: httpServer
});

chokidar.watch('../user').on('all', (event, path) => {
    console.log('path added: ', path);
    wss.emit('files:refresh', path);
});