import random
import time


class EyeTracker:
    """Lightweight EyeTracker stub for dev: returns simulated metrics.

    This avoids heavy binary deps (mediapipe/opencv/pandas) so the
    backend can run in development environments.
    """
    def __init__(self):
        self.blink_count = 0
        self._last_blink = 0.0

    def process_frame(self, frame_bytes):
        """Simulate processing and return a small metrics dict.

        Args:
            frame_bytes: raw image bytes (ignored by stub)

        Returns:
            dict with keys: 'ear', 'blink_detected', 'blink_count', 'gaze_direction'
        """
        # Simulate EAR between 0.12 (closed) and 0.35 (open)
        ear = round(random.uniform(0.14, 0.33), 3)

        # Randomly detect a blink with low probability
        blink_detected = False
        if random.random() < 0.02:
            blink_detected = True
            self.blink_count += 1
            self._last_blink = time.time()

        # Simple gaze simulation
        gaze_direction = random.choice(["center", "left", "right", "up", "down"])

        return {
            "ear": ear,
            "blink_detected": blink_detected,
            "blink_count": self.blink_count,
            "gaze_direction": gaze_direction,
        }

    def reset(self):
        self.blink_count = 0
