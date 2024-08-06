import express from 'express';
import {WebSocket, WebSocketServer} from 'ws';
import * as pty from 'node-pty';
import cookieParser from 'cookie-parser';

const PORT = 8082;

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
const wss = new WebSocketServer({
    server: httpServer
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

    ws.on('message', (data: string) => {
        console.log('received data from the client: ', data);
        ptyProcess.write(data + '\r');
    });

    ws.on('close', () => {
        ptyProcess.kill();
    });
});