import Database from 'better-sqlite3';

const db = new Database('./webhooks.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS webhooks (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    events TEXT NOT NULL
  );
`);

export function insert(id, url, events) {
  db.prepare('INSERT INTO webhooks (id,url,events) VALUES (?,?,?)')
    .run(id, url, JSON.stringify(events));
}

export function remove(id) {
  db.prepare('DELETE FROM webhooks WHERE id=?').run(id);
}

export function all() {
  return db.prepare('SELECT * FROM webhooks').all()
           .map(r => ({ ...r, events: JSON.parse(r.events) }));
}
