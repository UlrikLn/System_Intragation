/**
 * Express-backend med Firebase Admin SDK.
 * Denne server beskytter ruter, der kun må tilgås af godkendte brugere,
 * ved at tjekke Firebase ID-tokens sendt fra frontend.
 */


import express from 'express';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); 

// Indlæs Firebase service account key (privat nøgle til backend-brug)
// Denne nøgle skal ALDRIG placeres i frontend — den giver fuld adgang til Firebase-projektet.
const serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
  );

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});

// Middleware til at tjekke, om anmodningen har et gyldigt Firebase ID-token
function checkAuth(req, res, next) {
const idToken = req.headers.authorization?.split('Bearer ')[1];
if (!idToken) return res.status(401).send('No token provided');

// Verificer ID-token med Firebase
admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
    req.user = decodedToken;
    next();
    })
    .catch(() => res.status(403).send('Unauthorized'));
}

// Beskyttet route: kræver gyldigt ID-token
app.get('/protected', checkAuth, (req, res) => {
res.send(`Hello ${req.user.email}, you are authenticated!`);
});

app.listen(3000, () => console.log('Server listening on port 3000'));
