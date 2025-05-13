import fetch from 'node-fetch';          // Node 18+: comment this line

const EXPOSEE_BASE = 'http://localhost:8080'; 

const response = await fetch(`${EXPOSEE_BASE}/webhooks/register`, {
  method : 'POST',
  headers: { 'Content-Type': 'application/json' },
  body   : JSON.stringify({
    url   : 'http://localhost:4000/webhook',
    events: ['payment.received', 'invoice.completed']
  })
});

const data = await response.json();
console.log('✅ registered with id', data.id);
