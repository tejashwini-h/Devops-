import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SessionTimerProps {
  isActive: boolean;
  onReset: () => void;
}

const SessionTimer = ({ isActive, onReset }: SessionTimerProps) => {
  const [seconds, setSeconds] = useState(0);
  const [showReminder, setShowReminder] = useState(false);

  // Optimized useEffect hook for timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          // 20-20-20 rule: every 20 minutes (1200 seconds)
          if (newSeconds % 1200 === 0 && newSeconds > 0) {
            setShowReminder(true);
            // Auto-hide reminder after 30 seconds
            setTimeout(() => setShowReminder(false), 30000);
          }
          return newSeconds;
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]); 
  
  // FIX: Local handler to correctly reset the state and call parent logic
  const handleLocalReset = () => {
    // 1. Reset the internal state to 0 (fixes the rendering issue)
    setSeconds(0);
    setShowReminder(false);
    
    // 2. Call the parent's prop function
    onReset();
  };


  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(seconds);
  const nextBreak = 1200 - (seconds % 1200);
  const nextBreakMinutes = Math.ceil(nextBreak / 60);

  return (
    <Card className="border-2 border-secondary/30 backdrop-blur-sm bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-[0_0_30px_hsl(280_80%_60%_/_0.2)] hover:scale-105 transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-card/50 border-2 border-secondary/20 text-secondary">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Session Timer</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLocalReset} // SYNTAX FIX APPLIED HERE
            className="text-xs hover:bg-secondary/10"
          >
            Reset
          </Button>
        </div>

        {/* Timer display */}
        <div className="text-center p-6 rounded-xl bg-card/30 border border-secondary/20 mb-4">
          <div className="text-sm text-muted-foreground mb-2">Active Time</div>
          <div className="flex items-center justify-center gap-2 text-5xl font-bold font-mono">
            <span className="text-secondary">{time.hours}</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-secondary">{time.minutes}</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-secondary">{time.seconds}</span>
          </div>
        </div>

        {/* 20-20-20 reminder */}
        {showReminder && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-accent/20 to-secondary/20 border-2 border-accent/30 animate-slide-up">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 animate-glow-pulse" />
              <div className="flex-1">
                <div className="font-semibold text-accent mb-1">Time for a break!</div>
                <div className="text-sm text-muted-foreground">
                  Look at something 20 feet away for 20 seconds to rest your eyes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next break countdown */}
        <div className="text-center p-4 rounded-xl bg-card/20 border border-secondary/10">
          <div className="text-xs text-muted-foreground mb-1">Next Break In</div>
          <div className="text-2xl font-bold text-secondary">
            {nextBreakMinutes} min
          </div>
        </div>

        {/* 20-20-20 rule info */}
        <div className="mt-4 p-3 rounded-lg bg-muted/10 border border-muted/20">
          <div className="text-xs font-semibold text-muted-foreground mb-1">20-20-20 Rule</div>
          <div className="text-xs text-muted-foreground">
            Every 20 minutes, look at something 20 feet away for 20 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionTimer;