import json
import yaml  #skulle installeres med pip install pyyaml
import csv
import xml.etree.ElementTree as ET

# Function to read a text file
def read_text(filename):
    with open(filename, 'r') as file:
        return [line.strip().split(", ") for line in file.readlines()]

# Function to read JSON
def read_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

# Function to read YAML
def read_yaml(filename):
    with open(filename, 'r') as file:
        return yaml.safe_load(file)

# Function to read CSV
def read_csv(filename):
    with open(filename, 'r') as file:
        reader = csv.DictReader(file)
        return [row for row in reader]

# Function to read XML
def read_xml(filename):
    tree = ET.parse(filename)
    root = tree.getroot()
    data = []
    for item in root:
        data.append({child.tag: child.text for child in item})
    return data

print(read_text("data/txt_products.txt"))
print(read_json("data/json_products.json"))
print(read_yaml("data/yaml_products.yaml"))
print(read_csv("data/csv_products.csv"))
print(read_xml("data/xml_products.xml"))

# poetry shell
# python pyParser.py