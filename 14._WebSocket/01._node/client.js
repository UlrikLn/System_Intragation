import {WebSocket}from "ws";

const webSocketClient = new WebSocket("ws://localhost:8080");

webSocketClient.on("open", () => {
    webSocketClient.send("Sending a client message from Node.js");

    webSocketClient.on("message", (message) => {
        console.log(`Receives a message from the server: ${message}`);

        // webSocketClient.close();
    });
});