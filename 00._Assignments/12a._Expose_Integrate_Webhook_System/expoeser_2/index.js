import express from "express";
import Database from "better-sqlite3";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // Bruges til at sende HTTP-forespørgsler (fx POST til webhooks)
const app = express();

// læser tekstbaserede forespørgsler
app.use(express.text({ type: "*/*" }));

// hvis body’en ligner JSON, prøver vi at parse den
app.use((req, _res, next) => {
  if (typeof req.body === "string" && req.body.trim().startsWith("{")) {
    try { req.body = JSON.parse(req.body); } catch { /* ignore parse errors */ }
  }
  next();
});

// body-parser til at håndtere JSON-request bodies
app.use(bodyParser.json());

// Opretter en lokal SQLite-database
const db = new Database("webhooks.db");

// Sætter journal mode til WAL (Write-Ahead Logging) for bedre ydeevne
db.pragma("journal_mode = WAL");

// Opretter tabellen til at gemme webhooks, hvis den ikke allerede findes
db.exec(`
  CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    event_type TEXT NOT NULL,
    UNIQUE(url, event_type)
  );
`);

// Definerer de understøttede hændelsestyper
export const EVENTS = [
  "payment_received",
  "payment_processed",
  "invoice_processing",
  "invoice_completed",
];

// Forbereder SQL-forespørgsler til at håndtere webhooks
const stmInsert = db.prepare("INSERT OR IGNORE INTO webhooks(url, event_type) VALUES (?, ?)");
const stmDelete = db.prepare("DELETE FROM webhooks WHERE url = ? AND event_type = ?");
const stmDeleteAll = db.prepare("DELETE FROM webhooks WHERE url = ?");
const stmSelectByEvent = db.prepare("SELECT DISTINCT url FROM webhooks WHERE event_type = ?");
const stmSelectAll = db.prepare("SELECT DISTINCT url FROM webhooks");


// Endpoint: registrer en webhook til bestemte events
// Her gemmes webhook URL og de events, den lytter til
app.post("/webhooks/register", (req, res) => {
  const { url, eventTypes } = req.body || {};
  if (!url || !Array.isArray(eventTypes) || eventTypes.length === 0) {
    return res.status(400).json({ error: "'url' and non‑empty 'eventTypes[]' are required" });
  }
  for (const evt of eventTypes) {
    if (!EVENTS.includes(evt)) {
      return res.status(400).json({ error: `Unknown event type: ${evt}` });
    }
    stmInsert.run(url, evt); // Indsæt webhook
  }
  res.status(201).json({ success: true });
});

// Endpoint: afregistrér en webhook (enten for bestemte events eller alle)
app.post("/webhooks/unregister", (req, res) => {
  const { url, eventTypes } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: "'url' is required" });
  }
  // Hvis der er specificerede event types, fjern kun dem
  if (Array.isArray(eventTypes) && eventTypes.length > 0) {
    for (const evt of eventTypes) {
      stmDelete.run(url, evt); // Fjern specifik event binding
    }
  } else {
    stmDeleteAll.run(url);  // Fjern alle bindings for denne URL
  }
  res.json({ success: true });
});

// Endpoint: send test (ping) til alle registrerede webhooks
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

// Endpoint: send den bedte event til alle, der lytter til den
// Og efter fortæl hvor mange lytter med til her.
app.post("/events/:type", async (req, res) => {
  const { type } = req.params;
  if (!EVENTS.includes(type)) {
    return res.status(404).json({ error: "Unknown event type" });
  }
  // Hent alle webhooks, der lytter til denne event type
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

