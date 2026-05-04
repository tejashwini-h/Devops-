import { useEffect, useRef } from "react"; // 1. Import useRef
import { toast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface FatigueDetectorProps {
  blinkRate: number;
  isMonitoring: boolean;
  onFatigueDetected: () => void;
}

const FatigueDetector = ({ blinkRate, isMonitoring, onFatigueDetected }: FatigueDetectorProps) => {
  // 2. Create a ref to hold the latest blinkRate
  const latestBlinkRate = useRef(blinkRate);

  // 3. Update the ref every time the blinkRate prop changes (runs on every render)
  useEffect(() => {
    latestBlinkRate.current = blinkRate;
  }, [blinkRate]);


  useEffect(() => {
    if (!isMonitoring) return;

    // Check for fatigue indicators every 15 seconds
    const fatigueInterval = setInterval(() => {
      // **FIX:** Read the latest rate from the ref, NOT the stale prop value
      const currentRate = latestBlinkRate.current; 

      // Detect fatigue based on very low blink rate (< 8 per minute)
      if (currentRate < 8) { // Use currentRate here
        onFatigueDetected();
        
        // Show fatigue warning
        toast({
          title: "⚠️ Fatigue Detected",
          description: "Your blink rate is very low. Consider taking a break to rest your eyes.",
          variant: "destructive",
        });

        // Browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("NeuroLens - Fatigue Alert", {
            body: "Drowsiness detected. Time for a break!",
            icon: "/favicon.ico",
            badge: "/favicon.ico",
          });
        }
      }
      
      // Detect possible drowsiness (blink rate 8-10 range)
      else if (currentRate >= 8 && currentRate < 10) { // Use currentRate here
        toast({
          title: "😴 Low Blink Rate",
          description: "You might be getting tired. Consider taking a short break.",
        });
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(fatigueInterval);
    
  // **CRUCIAL CHANGE:** Removed `blinkRate` from dependencies array
  // We only want the effect to run once when `isMonitoring` changes.
  }, [isMonitoring, onFatigueDetected]); 

  return null;
};

export default FatigueDetector;