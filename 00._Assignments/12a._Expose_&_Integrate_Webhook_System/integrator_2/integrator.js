import express from "express";
const app = express();
app.use(express.json());

const events = [];

// Hook to receive events
app.post("/hook", (req, res) => {
  const entry = { time: new Date().toISOString(), payload: req.body };
  events.unshift(entry);          // newest first
  console.log("Received event:", entry);
  res.sendStatus(200);
});

// UI to show received events
app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html>
  <meta charset="utf-8"><title>Webhook Log</title>
  <style>
    body{font-family:sans-serif;margin:2rem;}
    pre{background:#f4f4f4;padding:1rem;border-radius:6px;overflow:auto;}
  </style>
  <h1>Received events (${events.length})</h1>
  <button onclick="location.reload()">🔄 refresh</button>
  ${events.map(e => `<pre>${JSON.stringify(e,null,2)}</pre>`).join("")}
  `);
});

app.listen(4000, () => console.log("Receiver listening on http://localhost:4000"));
