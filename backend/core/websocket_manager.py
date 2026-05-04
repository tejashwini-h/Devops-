from fastapi import WebSocket
from typing import Dict, List
import json
import asyncio
from ml.eye_tracker import EyeTracker
from ml.fatigue_detector import FatigueDetector
import base64

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.eye_trackers: Dict[str, EyeTracker] = {}
        self.fatigue_detectors: Dict[str, FatigueDetector] = {}
        
    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.eye_trackers[client_id] = EyeTracker()
        self.fatigue_detectors[client_id] = FatigueDetector()
        print(f"Client {client_id} connected")
        
    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)
        self.eye_trackers.pop(client_id, None)
        self.fatigue_detectors.pop(client_id, None)
        print(f"Client {client_id} disconnected")
        
    async def process_frame(self, client_id: str, frame_data: dict):
        """Process a frame from the client."""
        try:
            # Get the base64 encoded image data
            image_data = frame_data.get('image')
            if not image_data:
                return None
                
            # Decode base64 image payload and pass raw bytes to the tracker.
            # The real tracker normally expects an image array (OpenCV),
            # but we use a lightweight tracker in environments without cv2.
            img_bytes = base64.b64decode(image_data.split(',')[-1])
            frame = img_bytes
                
            # Process the frame with eye tracker
            eye_tracker = self.eye_trackers.get(client_id)
            if eye_tracker:
                eye_data = eye_tracker.process_frame(frame)
                
                # Update fatigue detector
                fatigue_detector = self.fatigue_detectors.get(client_id)
                if fatigue_detector and 'ear' in eye_data:
                    fatigue_data = fatigue_detector.update({
                        'ear': eye_data['ear'],
                        'blink_detected': eye_data['blink_detected'],
                        'gaze_direction': eye_data.get('gaze_direction', 'center')
                    })
                    
                    # Add recommendations
                    recommendations = fatigue_detector.get_recommendations(fatigue_data)
                    fatigue_data['recommendations'] = recommendations
                    
                    # Combine eye and fatigue data
                    result = {
                        **eye_data,
                        'fatigue': fatigue_data,
                        'timestamp': frame_data.get('timestamp')
                    }
                    
                    return result
                    
        except Exception as e:
            print(f"Error processing frame: {e}")
            return None
    
    async def broadcast(self, client_id: str, message: dict):
        """Send a message to a specific client."""
        connection = self.active_connections.get(client_id)
        if connection:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending message to {client_id}: {e}")
                self.disconnect(client_id)

# Global instance
manager = ConnectionManager()
