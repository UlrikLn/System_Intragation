from fastapi import FastAPI
import requests
import csv
import json
import yaml # Husk at installere PyYAML med poetry add pyyaml

app = FastAPI() # Man skriver main fordi det er hvad filen hedder i "uvicorn main:app --reload" app er det den hedder her.

DATA_FOLDER = "/Users/ulriklehun/Documents/System_Intragation/00._Assignments/03a._Data_Parsing_Servers/data/"

# -------- XML Endpoint --------
@app.get("/xml")
def get_xml_data():
    with open(f"{DATA_FOLDER}xml_products.xml", "r") as file:
        return {"data": file.read()}

# -------- CSV Endpoint --------
@app.get("/csv")
def get_csv_data():
    with open(f"{DATA_FOLDER}csv_products.csv", newline="") as file:
        reader = csv.DictReader(file)
        return list(reader)

# -------- YAML Endpoint --------
@app.get("/yaml")
def get_yaml_data():
    with open(f"{DATA_FOLDER}yaml_products.yaml", "r") as file:
        return yaml.safe_load(file)

# -------- TXT Endpoint --------
@app.get("/txt")
def get_txt_data():
    with open(f"{DATA_FOLDER}txt_products.txt", "r") as file:
        return {"data": file.read()}

# -------- JSON Endpoint --------
@app.get("/json")
def get_json_data():
    with open(f"{DATA_FOLDER}json_products.json", "r") as file:
        return json.load(file)


# -------- Snak med Server B --------
@app.get("/requestToNode/{format}")
def request_node_data(format: str):
    response = requests.get(f"http://127.0.0.1:8080/{format}").json() # Integrere med node her
    return response


