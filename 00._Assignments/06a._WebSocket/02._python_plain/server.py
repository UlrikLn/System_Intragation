import asyncio
from websockets.asyncio.server import serve


async def handle_new_websocket(websocket):
    async for message in websocket:
        print(f"Received message: {message}")
        await websocket.send(message)


async def main():
    # Start the webSocket server
    # Port 8765 would be standard
    # but we will use 8000 to keep it aligned with the rest of the course material
    async with serve(handle_new_websocket, "localhost", 8000) as server:
        await server.serve_forever()

asyncio.run(main())