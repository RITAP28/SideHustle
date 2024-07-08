import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const httpServer = app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", function connection(ws){
    ws.on("error", (error) => console.error(error));

    ws.on("message", function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if(client.readyState === WebSocket.OPEN){
                client.send(data, {
                    binary: isBinary
                });
            }
        });
    });

    ws.send("Hello! message from server");
});