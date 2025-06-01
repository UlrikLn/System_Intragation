import { WebSocketServer} from "ws";

const PORT = process.env.PORT ?? 8080;

// Create a WebSocket server
const server = new WebSocketServer({ port: PORT });


server.on("connection", (ws) => {
    console.log("New Connection:", server.clients.size);

    // Log the meassage from the client
    ws.on("message", (message) => {
        console.log(`Receives a message from the Client: ${message}`);

        // Broadcast the message to all connected clients
        server.clients.forEach((client) => {
                client.send(String(message));
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected:", server.clients.size);
    });

    
});