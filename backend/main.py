from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import cv2
import base64
import asyncio
import uuid
from core.websocket_manager import manager

app = FastAPI(
    title="NeuroLens API",
    description="Backend API for NeuroLens Eye Coach Application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/client-id")
async def get_client_id():
    return {"client_id": str(uuid.uuid4())}

# WebSocket endpoint
@app.websocket("/ws/eye-tracking/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)
    
    try:
        while True:
            # Receive frame data from client
            data = await websocket.receive_json()
            
            # Process the frame using the manager
            result = await manager.process_frame(client_id, data)
            
            if result:
                await manager.broadcast(client_id, result)
                
    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        print(f"Error in WebSocket connection: {e}")
        manager.disconnect(client_id)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )