import express from 'express';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); 

const serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
  );

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});

function checkAuth(req, res, next) {
const idToken = req.headers.authorization?.split('Bearer ')[1];
if (!idToken) return res.status(401).send('No token provided');

admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
    req.user = decodedToken;
    next();
    })
    .catch(() => res.status(403).send('Unauthorized'));
}

app.get('/protected', checkAuth, (req, res) => {
res.send(`Hello ${req.user.email}, you are authenticated!`);
});

app.listen(3000, () => console.log('Server listening on port 3000'));
