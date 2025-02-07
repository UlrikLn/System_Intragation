import express from 'express';

const app = express();


app.get('/', (req,res) => {
    res.send({data: "Root route"});
});

app.get('/tasks', (req,res) => {
    res.send({data: "Husk at lav det der part 2 opgave"});
});

app.get('/greetings', (req,res) => {
    res.send({data: "wazzup"});
});

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));