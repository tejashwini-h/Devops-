import { Eye } from "lucide-react";
// Assuming Card and CardContent are correctly imported from your UI library
import { Card, CardContent } from "@/components/ui/card"; 

interface BlinkCounterProps {
  /** The total running blink count since monitoring started */
  count: number;
  /** The calculated blinks per minute (BPM) rate */
  rate: number; 
}

const BlinkCounter = ({ count, rate }: BlinkCounterProps) => {
  // ✅ Logic for determining health status
  const isHealthy = rate >= 15 && rate <= 20; // Normal blink rate: 15-20 per minute
  const isLow = rate < 15;
  
  // Dynamic status text for better user feedback
  const statusText = isHealthy ? "HEALTHY" : isLow ? "LOW" : "HIGH";

  // Dynamic class assignment based on status
  const statusClasses = isHealthy
    ? "bg-green-400/20 text-green-400"
    : isLow
    ? "bg-yellow-400/20 text-yellow-400"
    : "bg-red-400/20 text-red-400";
    
  // Dynamic color for the blink rate number
  const rateColorClass = isHealthy ? "text-green-400" : isLow ? "text-yellow-400" : "text-red-400";


  return (
    <Card className="border-2 border-primary/30 backdrop-blur-sm bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_0_30px_hsl(193_100%_50%_/_0.2)] hover:scale-105 transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-card/50 border-2 border-primary/20 text-primary">
              <Eye className="w-6 h-6 animate-glow-pulse" />
            </div>
            <h3 className="text-lg font-semibold">Blink Detection</h3>
          </div>
          {/* Status Chip */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
            {statusText}
          </div>
        </div>

        <div className="space-y-4">
          {/* Blink count (Large Display) */}
          <div className="text-center p-6 rounded-xl bg-card/30 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">Total Blinks</div>
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {count}
            </div>
          </div>

          {/* Blink rate Comparison Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Blink Rate */}
            <div className="text-center p-4 rounded-xl bg-card/20 border border-primary/10">
              <div className="text-xs text-muted-foreground mb-1">Your Rate/Min</div>
              <div className={`text-2xl font-bold ${rateColorClass}`}>{rate}</div>
            </div>
            {/* Normal Range */}
            <div className="text-center p-4 rounded-xl bg-card/20 border border-primary/10">
              <div className="text-xs text-muted-foreground mb-1">Optimal Range</div>
              <div className="text-2xl font-bold text-green-400">15-20</div>
            </div>
          </div>

          {/* Info Message */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            {isHealthy && "Your blink rate is healthy! Keep it up."}
            {isLow && "Blink more frequently to prevent dry eyes."}
            {!isHealthy && !isLow && "Blinking too frequently can indicate fatigue or strain."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlinkCounter;
