import express from 'express';

const app = express();

app.use(express.static('public'));

app.get("/synchronizetime", (req, res) => {
    res.writeHead(200,{
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache"
    });

    setInterval(() => sendTimeToClient(res), 1000);
});

function sendTimeToClient(res) {
    const time = new Date().toISOString();

    // Der skal stå data: foran time, for at det bliver sendt som data/læses af eventsource
    res.write(`data: ${time} \n\n`); // write keeps the connection open compared to res.send
}

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log("Server is running on port " + PORT));