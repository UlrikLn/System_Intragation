const fs = require("fs");
const yaml = require("js-yaml");
const xml2js = require("xml2js");
const csv = require("csv-parser");

// Function to read a text file
function readText(filename) {
  const data = fs.readFileSync(filename, "utf-8");
  return data.split("\n").map(line => line.split(", "));
}

// Function to read JSON
function readJSON(filename) {
  const data = fs.readFileSync(filename, "utf-8");
  return JSON.parse(data);
}

// Function to read YAML
function readYAML(filename) {
  const data = fs.readFileSync(filename, "utf-8");
  return yaml.load(data);
}

// Function to read CSV
function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// Function to read XML
function readXML(filename) {
  const data = fs.readFileSync(filename, "utf-8");
  const parser = new xml2js.Parser();
  return parser.parseStringPromise(data).then(result => result);
}

// Function to read xml but with stringyfied output
function readXML(filename) {
    const data = fs.readFileSync(filename, "utf-8");
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(data).then(result => {
        // Stringify the parsed object with indentation for readability
        console.log(JSON.stringify(result, null, 2));
        return result;
    });
}


// Running the functions
(async () => {
  console.log("TXT:", readText("data/txt_products.txt"));
  console.log("JSON:", readJSON("data/json_products.json"));
  console.log("YAML:", readYAML("data/yaml_products.yaml"));
  console.log("CSV:", await readCSV("data/csv_products.csv"));
  console.log("XML:", await readXML("data/xml_products.xml"));
})();

