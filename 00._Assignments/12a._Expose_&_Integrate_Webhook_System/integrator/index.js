import express    from 'express';
import bodyParser from 'body-parser';

const app  = express();
const PORT = 4000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('🔔 webhook received →', JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

app.listen(PORT, () =>
  console.log(`Integrator listening on :${PORT}`));
