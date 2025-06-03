import express from 'express';
import fs from 'fs';
import yaml from 'js-yaml';

const app = express();
const PORT = 8080;

const DATA_FOLDER = "/Users/ulriklehun/Documents/System_Intragation/00._Assignments/03a._Data_Parsing_Servers/data/";

// -------- XML Endpoint --------
app.get('/xml', (req, res) => {
    const data = fs.readFileSync(`${DATA_FOLDER}xml_products.xml`, 'utf8');
    res.json(data);
});

// -------- CSV Endpoint --------
app.get('/csv', (req, res) => {
    const data = fs.readFileSync(`${DATA_FOLDER}csv_products.csv`, 'utf8');
    const rows = data.split('\n').map(row => row.split(',')); 
    res.json(rows);
});

// -------- YAML Endpoint --------
app.get('/yaml', (req, res) => {
    const data = fs.readFileSync(`${DATA_FOLDER}yaml_products.yaml`, 'utf8');
    const yamlData = yaml.load(data);
    res.json(yamlData);
});

// -------- TXT Endpoint --------
app.get('/txt', (req, res) => {
    const data = fs.readFileSync(`${DATA_FOLDER}txt_products.txt`, 'utf8');
    res.json(data);
});

// -------- JSON Endpoint --------
app.get('/json', (req, res) => {
    const data = fs.readFileSync(`${DATA_FOLDER}json_products.json`, 'utf8');
    res.json(JSON.parse(data));
});

// -------- Snak med Server A --------
app.get('/requestToFastAPI/:format', async (req, res) => {
    const format = req.params.format;
    const response = await fetch(`http://127.0.0.1:8000/${format}`); // integere med FastAPI server
    const data = await response.json();
    res.json(data);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
