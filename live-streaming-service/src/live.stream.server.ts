import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const httpServer = app.listen(8081, () => {
    console.log('Server listening on port 8081');
});

app.use(express.json());

const wss = new WebSocketServer({
    server: httpServer
});

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws){
    ws.on('error', (err) => console.error(err));

    ws.on('message', function message(data: any){
        const message = JSON.parse(data);
        console.log(message);

        // adding message handlers
        if(message.type === 'sender'){
            senderSocket = ws;
        } else if(message.type === 'receiver'){
            receiverSocket = ws;
        } else if(message.type === 'createOffer'){
            receiverSocket?.send(JSON.stringify({
                type: 'createOffer',
                sdp: message.sdp
            }));
        } else if(message.type === 'createAnswer'){
            senderSocket?.send(JSON.stringify({
                type: 'createAnswer',
                sdp: message.sdp
            }));
        } else if(message.type === 'iceCandidate'){
            if(ws === senderSocket){
                receiverSocket?.send(JSON.stringify({
                    type: 'iceCandidate',
                    sdp: message.candidate
                }))
            } else if(ws === receiverSocket){
                senderSocket?.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: message.candidate
                }))
            };
        };
    });
    
    ws.send('Something');
});
