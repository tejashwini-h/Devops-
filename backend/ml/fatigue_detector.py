import numpy as np
from collections import deque
from typing import Dict, Any, Optional

class FatigueDetector:
    def __init__(self, window_size: int = 30):
        """Initialize the fatigue detector with a sliding window.
        
        Args:
            window_size: Number of frames to consider for fatigue analysis
        """
        self.window_size = window_size
        self.eye_ar_history = deque(maxlen=window_size)  # Eye Aspect Ratio history
        self.blink_history = deque(maxlen=window_size)   # Blink history (1 for blink, 0 for no blink)
        self.gaze_history = deque(maxlen=window_size)    # Gaze direction history
        
        # Fatigue thresholds (can be adjusted based on testing)
        self.ear_threshold = 0.2         # Below this EAR is considered an eye closure
        self.perclos_threshold = 0.15    # PERCLOS threshold for fatigue
        self.blink_rate_threshold = 12    # Blinks per minute (low threshold)
        self.yawn_threshold = 0.5        # Placeholder for yawn detection
        
    def update(self, eye_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update the detector with new eye tracking data.
        
        Args:
            eye_data: Dictionary containing eye tracking metrics
            
        Returns:
            Dictionary with fatigue analysis results
        """
        results = {
            'fatigue_level': 'low',
            'fatigue_score': 0.0,
            'perclos': 0.0,
            'blink_rate': 0.0,
            'symptoms': []
        }
        
        # Update history
        self.eye_ar_history.append(eye_data.get('ear', 0.3))
        self.blink_history.append(1 if eye_data.get('blink_detected', False) else 0)
        self.gaze_history.append(eye_data.get('gaze_direction', 'center'))
        
        # Calculate PERCLOS (Percentage of Eye Closure)
        if len(self.eye_ar_history) > 10:  # Need enough samples
            perclos = sum(1 for ear in self.eye_ar_history if ear < self.ear_threshold) / len(self.eye_ar_history)
            results['perclos'] = perclos
            
            # Calculate blink rate (blinks per minute)
            blink_rate = sum(self.blink_history) / (len(self.blink_history) / 30) * 60  # Assuming 30 FPS
            results['blink_rate'] = blink_rate
            
            # Check for fatigue symptoms
            symptoms = []
            
            # 1. Check for eye closure (PERCLOS)
            if perclos > self.perclos_threshold:
                symptoms.append('prolonged_eye_closure')
                
            # 2. Check for low blink rate
            if blink_rate < self.blink_rate_threshold:
                symptoms.append('low_blink_rate')
                
            # 3. Check for gaze instability (rapid changes in gaze direction)
            if len(self.gaze_history) > 5:
                gaze_changes = sum(1 for i in range(1, len(self.gaze_history)) 
                                 if self.gaze_history[i] != self.gaze_history[i-1])
                if gaze_changes / len(self.gaze_history) > 0.5:  # More than 50% changes
                    symptoms.append('unstable_gaze')
            
            # Calculate fatigue score (0-100)
            fatigue_score = min(100, perclos * 200 + 
                              (1 - min(1, blink_rate / self.blink_rate_threshold)) * 50)
            results['fatigue_score'] = fatigue_score
            
            # Determine fatigue level
            if fatigue_score > 70:
                results['fatigue_level'] = 'high'
            elif fatigue_score > 40:
                results['fatigue_level'] = 'medium'
            else:
                results['fatigue_level'] = 'low'
                
            results['symptoms'] = symptoms
        
        return results
    
    def get_recommendations(self, fatigue_data: Dict[str, Any]) -> list:
        """Get recommendations based on fatigue analysis.
        
        Args:
            fatigue_data: Dictionary containing fatigue analysis results
            
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        if fatigue_data['fatigue_level'] == 'high':
            recommendations.extend([
                "Take a 5-minute break and rest your eyes",
                "Try the 20-20-20 rule: look at something 20 feet away for 20 seconds",
                "Consider taking a short walk to refresh your mind"
            ])
        elif fatigue_data['fatigue_level'] == 'medium':
            recommendations.extend([
                "Blink more frequently to keep your eyes moist",
                "Adjust your screen brightness to reduce eye strain",
                "Make sure you're sitting at an appropriate distance from your screen"
            ])
        else:
            recommendations.append("Your eye fatigue level is good. Keep up the good habits!")
            
        if 'prolonged_eye_closure' in fatigue_data['symptoms']:
            recommendations.append("Your eyes are closing frequently. Consider taking a short break.")
            
        if 'low_blink_rate' in fatigue_data['symptoms']:
            recommendations.append("You're blinking less than usual. Try to blink more often to prevent dry eyes.")
            
        if 'unstable_gaze' in fatigue_data['symptoms']:
            recommendations.append("Your gaze seems unstable. Make sure you're not feeling too tired.")
            
        return recommendations
