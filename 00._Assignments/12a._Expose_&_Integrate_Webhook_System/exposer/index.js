import express       from 'express';
import { v4 as uuid } from 'uuid';
import * as db       from './db.js';

const app  = express();
const PORT = process.env.PORT || 8080;
const id = uuid();

app.use(express.json());

app.post('/webhooks/register', (req, res) => {
  const { url, events } = req.body;
  if (!url || !Array.isArray(events) || !events.length) {
    return res.status(400).json({ error: 'url and events[] required' });
  }
  db.insert(id, url, events);
  res.json({ id, url, events });
});

app.delete('/webhooks/:id', (req, res) => {
  db.remove(req.params.id);
  res.json({ removed: req.params.id });
});

app.get('/ping', async (_req, res) => {
  const hooks = db.all();
  await Promise.all(hooks.map(h =>
    fetch(h.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'ping', msg: 'Webhook ping 😊' })
    }).catch(e => console.error('Ping failed', h.url, e.message))
  ));
  res.json({ sent: hooks.length });
});

app.post('/events/:type', async (req, res) => {
  const type = req.params.type;
  const payload = req.body.payload ?? {};
  const hooks = db.all().filter(h => h.events.includes(type));
  await Promise.all(hooks.map(h =>
    fetch(h.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload, ts: Date.now() })
    }).catch(e => console.error('Event failed', h.url, e.message))
  ));
  res.json({ delivered: hooks.length });
});

app.listen(PORT, () => console.log(`Exposee running on :${PORT}`));
