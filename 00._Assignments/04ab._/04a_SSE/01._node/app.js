import express from 'express';

const app = express();

app.use(express.static('public'));

app.get("/synchronizetime", (req, res) => {
    // 200 er status code for OK
    res.writeHead(200,{
        // Dette er en server-sent event (SSE) endpoint
        // Connection skal være keep-alive for at holde forbindelsen åben
        // Content-Type skal være text/event-stream for at klienten kan forstå det som en SSE
        // Cache-Control skal være no-cache for at undgå caching af svar
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache"
    });

    // Hvor ofte vi sender tid til klienten
    setInterval(() => sendTimeToClient(res), 1000);
});

function sendTimeToClient(res) {
    const time = new Date().toISOString();

    // Der skal stå data: foran time, for at det bliver sendt som data/læses af eventsource
    res.write(`data: ${time} \n\n`); // write keeps the connection open compared to res.send
}

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log("Server is running on port " + PORT));