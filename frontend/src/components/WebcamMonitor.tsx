import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Define the structure for the data we expect from the blink detection
interface BlinkData {
  count: number;
  rate: number; // Blinks per minute (BPM)
}

interface WebcamMonitorProps {
  isActive: boolean;
  onToggle: () => void;
  // 🔥 PROP: Function to receive the real-time blink data
  onBlinkData: (data: BlinkData) => void;
  // NOTE: If you integrate the EyeTrackingService, you must add it here:
  // eyeTrackingService: EyeTrackingService;
}

const FRAME_INTERVAL = 200; // Process a frame every 200ms (5 frames per second)
// 🚨 STABILITY FIX: Throttling variables outside the component 
// to prevent excessive state updates and stabilize the useEffect dependency chain.
const THROTTLE_COUNT = 5; // Update state only every 5 frames (~1 second)
let frameCounter = 0; // Tracks frames processed since last state update

const WebcamMonitor = ({ isActive, onToggle, onBlinkData }: WebcamMonitorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // For frame processing
  
  // ✅ FIX: Use useRef for the interval ID to keep it local and stable
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // State to hold the live blink data (used for internal simulation/display)
  const [blinkData, setBlinkData] = useState<BlinkData>({ count: 0, rate: 0 });

  // 1. ✅ FIX: processFrame wrapped in useCallback
  const processFrame = useCallback((canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    const context = canvas.getContext('2d');
    if (context) {
      // 1. Draw video frame onto canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 🚨 STABILITY FIX: Apply throttling
      frameCounter++;
      if (frameCounter < THROTTLE_COUNT) {
          return; // Skip state update for this frame
      }
      frameCounter = 0; // Reset counter

      // 2. Simulate AI Model / Backend Update
      // **REPLACE THIS WITH YOUR ACTUAL AI/Websocket LOGIC HERE**
      // **********************************************************
      
      setBlinkData(prevData => {
        
        // ✅ CRITICAL FIX for counter reset (now increments indefinitely)
        const newCount = prevData.count + 1; 
        
        // SIMULATION: Generate a random-ish but healthy rate
        const newRate = Math.floor(Math.random() * 6) + 15;

        const newData = {
          count: newCount,
          rate: newRate
        };

        // 3. Send the updated data to the parent component
        if (typeof onBlinkData === 'function') {
          onBlinkData(newData); 
        }
        return newData;
      });
      
      // **********************************************************
    }
  }, [onBlinkData, setBlinkData]); // ✅ FIX: Added setBlinkData for full dependency list

  const startWebcam = async () => {
    console.log("Starting camera access...");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      console.log("Camera access granted");
      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setHasPermission(false);
      toast({
        title: "Camera access denied",
        description: "Please enable camera permissions to use NeuroLens",
        variant: "destructive",
      });
      onToggle(); // Automatically stop monitoring if access fails
    }
  };

  const stopWebcam = () => {
    console.log("Stopping webcam...");
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // ✅ FIX: Use ref for cleanup
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
    console.log("Webcam stopped");
  };

  // Handle isActive changes (Start/Stop camera)
  useEffect(() => {
    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }
    // Cleanup runs when component unmounts or isActive changes
    return () => stopWebcam();
  }, [isActive]);


  // ✅ UPDATED useEffect: Handle frame processing when stream is ready
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (isActive && video && stream && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear any previous interval
      if (monitoringIntervalRef.current) { 
        clearInterval(monitoringIntervalRef.current);
      }

      // Start the frame processing loop
      monitoringIntervalRef.current = setInterval(() => { 
        processFrame(canvas, video);
      }, FRAME_INTERVAL);

      console.log("Frame processing started.");
    }

    // Cleanup function stops the processing loop when stream/isActive changes
    return () => {
      if (monitoringIntervalRef.current) { 
        clearInterval(monitoringIntervalRef.current);
        monitoringIntervalRef.current = null; 
        console.log("Frame processing stopped.");
      }
    };
    // The dependency array is now stable because processFrame is stable.
  }, [stream, isActive, processFrame]); 


  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Hidden canvas for frame processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-card/50 backdrop-blur-sm shadow-[0_0_30px_hsl(193_100%_50%_/_0.2)]">

        {/* Video display */}
        <div className="relative aspect-video bg-black w-full h-[400px]">
          {isActive ? (
            <div className="w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  transform: 'scaleX(-1)',
                  backgroundColor: '#000',
                  display: stream ? 'block' : 'none'
                }}
                onCanPlay={() => {
                  videoRef.current?.play().catch(e => console.error("Play error:", e));
                }}
              />

              {/* Monitoring Overlays (UI elements preserved) */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                </div>
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide-down_2s_ease-in-out_infinite]"
                  style={{ animation: "slide-down 2s ease-in-out infinite" }}
                />
              </div>

              {/* Status indicator (UI preserved) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 z-10">
                <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
                <span className="text-xs text-primary font-medium">MONITORING</span>
              </div>
            </div>
          ) : (
            // Inactive state (UI preserved)
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
                <CameraOff className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Camera Inactive</h3>
                <p className="text-muted-foreground max-w-md">
                  {hasPermission === false
                    ? "Camera access denied. Please enable camera permissions in your browser settings."
                    : "Click the button below to start monitoring your eye health"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls (UI preserved) */}
        <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isActive ? "Real-time eye tracking active" : "Ready to monitor"}
            </div>
            <Button
              onClick={onToggle}
              variant={isActive ? "destructive" : "default"}
              className={
                isActive
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-[0_0_20px_hsl(193_100%_50%_/_0.3)]"
              }
            >
              {isActive ? (
                <>
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamMonitor;
