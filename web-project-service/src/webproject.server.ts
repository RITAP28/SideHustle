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
const wss = new WebSocketServer({
    server: httpServer
});

chokidar.watch('../user').on('all', (event, path) => {
    console.log('path added: ', path);
    wss.emit('files:refresh', path);
});

wss.on('connection', function connection(ws) {
    ws.on('error', (error) => {
        console.error('Error while establishing a websocket connection: ', error);
    });

    console.log('pty: ', pty);
    console.log('working directory: ', process.env.INIT_CWD);

    if(!pty || !pty.spawn){
        console.error('pty spawn is not defined');
        return;
    };

    const ptyProcess = pty.spawn('zsh', [], {
        name: 'xterm-zsh',
        cols: 80,
        rows: 30,
        cwd: process.env.INIT_CWD + '/user',
        env: process.env
    });

    ptyProcess.onData(data => {
        console.log('sending data to client: ', data);
        ws.send(data);
    });

    ws.emit('files:refresh');

    ws.on('files:change' ,({ path, content }) => {
        fs.writeFile(`./user/${path}`, content, (err) => {
            if(err){
                console.error(err);
            } else {
                console.log('all ok');
            }
        });
    })

    ws.on('message', (data: string) => {
        console.log('received data from the client: ', data);
        ptyProcess.write(data + '\r');
    });

    ws.on('close', () => {
        ptyProcess.kill();
    });
});