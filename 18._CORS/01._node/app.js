import express from 'express';
import cors from 'cors';

const app = express();

// Dette er globalt, så alle routes får CORS
//app.use(cors());

// Dette er kun for en spesifikk route, ved at sætte cors() i route
app.get("/timestamp", /*cors(),*/ (req, res) => {
    res.send({data: new Date()})
});

// Nu kan alle bruge den, men kun GET
// app.use(cors({
//     origin: "*",
//     methods: ["GET"]
// }))

// Global middleware der sætter repons headers på alle requests
// next() er nødvendig for at gå videre til næste middleware, det kan bruges til fx ip loggers
//app.use((req, res, next) => {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
//});

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => console.log("Server is running on port",PORT));