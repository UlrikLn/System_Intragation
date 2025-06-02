import express from "express";
const app = express();
app.use(express.json());

// Gemmer alle modtagne events i en simpel array i hukommelsen
const events = [];

// Endpoint til at modtage webhook-events
app.post("/hook", (req, res) => {
  const entry = { time: new Date().toISOString(), // timestamp
    payload: req.body }; // selve payload'en
  events.unshift(entry);         // Tilføj event først i listen (nyeste øverst)
  console.log("Received event:", entry);
  res.sendStatus(200);
});

// Endpoint til at vise en simpel HTML-side med modtagne events
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
