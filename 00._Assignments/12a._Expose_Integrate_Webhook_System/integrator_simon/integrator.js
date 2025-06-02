import express from 'express';

const app = express();

app.use(express.json());

// Definér et endpoint, der lytter på POST-anmodninger til /my-hook
app.post('/my-hook', (req, res) => {
  // Når der kommer en POST-anmodning, logges hele body til konsollen
  console.log('▶ Got payload:', req.body);
  // Svar med HTTP-status 200 OK for at bekræfte modtagelse
  res.sendStatus(200);
});
app.listen(4000, () => console.log('Listening on http://localhost:4000/my-hook'));