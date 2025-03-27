# FastAPI is a class that we are importing from the fastapi module.
import random
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
# streaming_response sætter vores tekst event streams for os. Altså det her man skulle skrive i node.
        #"Connection": "keep-alive",
        # "Content-Type": "text/event-stream",
        #"Cache-Control": "no-cache"
from fastapi.responses import StreamingResponse
from datetime import datetime
import asyncio

app = FastAPI()

temlates = Jinja2Templates(directory="templates")

@app.get("/")
def serve_root_page(request: Request):
    return temlates.TemplateResponse("index.html", {"request": request})

# en generator funktion er en funktion som???
async def date_generator():
      while True: 
            now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
            yield f"data: {now}\n\n"
            await asyncio.sleep(1)


async def spinning_globe():
        text = ["Dream big", "hustle hard", "stay humble."]
        while True:
            globe_frame = random.choice(text)
            yield f"data: {globe_frame}\n\n"
            await asyncio.sleep(1)

@app.get("/sse")
def sse():
        return StreamingResponse(spinning_globe(), media_type="text/event-stream")
    