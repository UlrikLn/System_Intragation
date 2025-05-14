import express from 'express';

const app = express();
app.use(express.json());
app.post('/my-hook', (req, res) => {
  console.log('▶ Got payload:', req.body);
  res.sendStatus(200);
});
app.listen(4000, () => console.log('Listening on http://localhost:4000/my-hook'));