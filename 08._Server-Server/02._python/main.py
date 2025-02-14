from fastapi import FastAPI
import requests

app = FastAPI() # Man skriver main fordi det er hvad filen hedder i "uvicorn main:app --reload" app er det den hedder her.

@app.get("/fastapiData")
def getFastAPIData():
    return { "data" : "Data from FastAPI" } # Returnerer dictionary med data key og string værdi

# Opret et request til expressData
@app.get("/requestExpressData")
def requestExpressData():
    response = requests.get("http://127.0.0.1:8080/expressData").json()

    return response