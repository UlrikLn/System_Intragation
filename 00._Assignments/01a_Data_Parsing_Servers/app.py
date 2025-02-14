
# Hvordan du kører programmet
# uvicorn app:app --reload


import json
import yaml  #skulle installeres med pip install pyyaml
import csv
import xml.etree.ElementTree as ET
from pathlib import Path
from fastapi import FastAPI


app = FastAPI()

DATA_DIR = Path("/Users/ulriklehun/Documents/System_Intragation/00_Assignments/01a_Data_Parsing_Servers/data")


# Function to read a text file
def read_text(filename):
    filepath = DATA_DIR / filename
    with open(filepath, 'r') as file:
        return [line.strip().split(", ") for line in file.readlines()]

# Function to read JSON
def read_json(filename):
    filepath = DATA_DIR / filename
    with open(filepath, 'r') as file:
        return json.load(file)

# Function to read YAML
def read_yaml(filename):
    filepath = DATA_DIR / filename
    with open(filepath, 'r') as file:
        return yaml.safe_load(file)

# Function to read CSV
def read_csv(filename):
    filepath = DATA_DIR / filename
    with open(filepath, 'r') as file:
        reader = csv.DictReader(file)
        return [row for row in reader]

# Function to read XML
def read_xml(filename):
    filepath = DATA_DIR / filename
    tree = ET.parse(filepath)
    root = tree.getroot()
    data = []
    for item in root:
        data.append({child.tag: child.text for child in item})
    return data


# FastAPI Endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to the Data Parsing API!"}

@app.get("/txt")
def get_text():
    return {"data": read_text("txt_products.txt")}

@app.get("/json")
def get_json():
    return {"data": read_json("json_products.json")}

@app.get("/yaml")
def get_yaml():
    return {"data": read_yaml("yaml_products.yaml")}

@app.get("/csv")
def get_csv():
    return {"data": read_csv("csv_products.csv")}

@app.get("/xml")
def get_xml():
    return {"data": read_xml("xml_products.xml")}

