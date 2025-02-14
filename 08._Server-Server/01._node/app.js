import express from 'express';
import fetch from 'node-fetch'; // Import the fetch module from node-fetch

const app = express();


app.get("/expressData", (req, res) => {
    //Du vil gerne sende det som et json, fordi "alle" kodesprog har et biblotek/måde til at håndtere json
    res.send({data: "This is the data from Express"});  
    
});

// Corrected function to request FastAPI data
app.get("/requestFastAPIData", async (req, res) => {
  
        const response = await fetch("http://127.0.0.1:8000/fastapiData"); // Her sker intregrationen mellem de to servere
        const result = await response.json();

        // res.send(result);
        res.send({data: result.data}); // Keep the same format as the Express data
    
});

app.get("/names/:name", (req, res) => {
    console.log(req.params.name);
    res.send({ data: `Your name is ${req.params.name}` });
});



const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));