import { useEffect, useRef, useState, useCallback } from 'react';
import { eyeTrackingService } from '@/services/eyeTrackingService';
import { toast } from '@/components/ui/use-toast';

interface EyeTrackingData {
  blink_detected: boolean;
  blink_count: number;
  ear: number;
  gaze_direction: string;
  fatigue: {
    fatigue_level: 'low' | 'medium' | 'high';
    fatigue_score: number;
    perclos: number;
    blink_rate: number;
    recommendations: string[];
  };
}

export const useEyeTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [trackingData, setTrackingData] = useState<EyeTrackingData | null>(null);
  const frameInterval = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((data: any) => {
    if (data.type === 'analysis') {
      setTrackingData(data.data);
    }
  }, []);

  // Initialize WebSocket connection
  const initTracking = useCallback(async () => {
    if (isConnected) return true;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize the WebSocket connection
      await eyeTrackingService.initialize();
      
      // Register message handler
      eyeTrackingService.onMessage(handleMessage);
      
      setIsConnected(true);
      return true;
    } catch (err) {
      console.error('Failed to initialize eye tracking:', err);
      setError('Failed to connect to the eye tracking service');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleMessage, isConnected]);

  // Start/stop tracking
  const toggleTracking = useCallback(async () => {
    if (isTracking) {
      // Stop tracking
      if (frameInterval.current) {
        window.cancelAnimationFrame(frameInterval.current);
        frameInterval.current = null;
      }
      setIsTracking(false);
      return;
    }

    // Start tracking
    const initialized = await initTracking();
    if (!initialized) return;

    setIsTracking(true);
    
    // Start capturing and sending frames
    const captureFrame = () => {
      if (!videoRef.current || !canvasRef.current || !isTracking) return;
      
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        // Set canvas dimensions to match video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data as base64
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        
        // Send frame for processing
        eyeTrackingService.sendFrame(imageData);
        
        // Continue the loop
        if (isTracking) {
          frameInterval.current = requestAnimationFrame(captureFrame);
        }
      } catch (err) {
        console.error('Error capturing frame:', err);
        setError('Error processing video frame');
        setIsTracking(false);
      }
    };
    
    // Start the frame capture loop
    frameInterval.current = requestAnimationFrame(captureFrame);
    
    return () => {
      if (frameInterval.current) {
        cancelAnimationFrame(frameInterval.current);
      }
    };
  }, [isTracking, initTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameInterval.current) {
        cancelAnimationFrame(frameInterval.current);
      }
      eyeTrackingService.offMessage(handleMessage);
      eyeTrackingService.disconnect();
    };
  }, [handleMessage]);

  // Show toast when fatigue level changes
  useEffect(() => {
    if (trackingData?.fatigue?.fatigue_level === 'high') {
      toast({
        title: "High Fatigue Detected",
        description: "Consider taking a break to rest your eyes.",
        variant: "destructive",
      });
    } else if (trackingData?.fatigue?.fatigue_level === 'medium') {
      toast({
        title: "Moderate Fatigue",
        description: "Your eyes are showing signs of fatigue. Take a moment to rest.",
      });
    }
  }, [trackingData?.fatigue?.fatigue_level]);

  return {
    videoRef,
    canvasRef,
    isTracking,
    isConnected,
    isLoading,
    error,
    trackingData,
    toggleTracking,
  };
};

export default useEyeTracking;
