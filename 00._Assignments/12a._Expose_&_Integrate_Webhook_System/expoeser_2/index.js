import express from "express";
import Database from "better-sqlite3";
import bodyParser from "body-parser";
import fetch from "node-fetch"; 

const app = express();

app.use(express.text({ type: "*/*" }));
app.use((req, _res, next) => {
  if (typeof req.body === "string" && req.body.trim().startsWith("{")) {
    try { req.body = JSON.parse(req.body); } catch { /* ignore parse errors */ }
  }
  next();
});

app.use(bodyParser.json());

const db = new Database("webhooks.db");
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    event_type TEXT NOT NULL,
    UNIQUE(url, event_type)
  );
`);

export const EVENTS = [
  "payment_received",
  "payment_processed",
  "invoice_processing",
  "invoice_completed",
];

const stmInsert = db.prepare("INSERT OR IGNORE INTO webhooks(url, event_type) VALUES (?, ?)");
const stmDelete = db.prepare("DELETE FROM webhooks WHERE url = ? AND event_type = ?");
const stmDeleteAll = db.prepare("DELETE FROM webhooks WHERE url = ?");
const stmSelectByEvent = db.prepare("SELECT DISTINCT url FROM webhooks WHERE event_type = ?");
const stmSelectAll = db.prepare("SELECT DISTINCT url FROM webhooks");


app.post("/webhooks/register", (req, res) => {
  const { url, eventTypes } = req.body || {};
  if (!url || !Array.isArray(eventTypes) || eventTypes.length === 0) {
    return res.status(400).json({ error: "'url' and non‑empty 'eventTypes[]' are required" });
  }
  for (const evt of eventTypes) {
    if (!EVENTS.includes(evt)) {
      return res.status(400).json({ error: `Unknown event type: ${evt}` });
    }
    stmInsert.run(url, evt);
  }
  res.status(201).json({ success: true });
});


app.post("/webhooks/unregister", (req, res) => {
  const { url, eventTypes } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: "'url' is required" });
  }
  if (Array.isArray(eventTypes) && eventTypes.length > 0) {
    for (const evt of eventTypes) {
      stmDelete.run(url, evt);
    }
  } else {
    stmDeleteAll.run(url);
  }
  res.json({ success: true });
});


app.post("/ping", async (_req, res) => {
  const rows = stmSelectAll.all();
  const payload = {
    event: "ping",
    timestamp: new Date().toISOString(),
  };
  const promises = rows.map((r) =>
    fetch(r.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null) 
  );
  await Promise.all(promises);
  res.json({ dispatched: rows.length });
});


app.post("/events/:type", async (req, res) => {
  const { type } = req.params;
  if (!EVENTS.includes(type)) {
    return res.status(404).json({ error: "Unknown event type" });
  }
  const rows = stmSelectByEvent.all(type);
  const payload = {
    event: type,
    data: req.body ?? {},
    timestamp: new Date().toISOString(),
  };
  const promises = rows.map((r) =>
    fetch(r.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null)
  );
  await Promise.all(promises);
  res.json({ dispatched: rows.length });
});


const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Exposee Webhook Service listening on :${PORT}`));

