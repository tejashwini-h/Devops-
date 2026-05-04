import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: "cyan" | "purple" | "pink" | "green";
  trend?: "up" | "down" | "neutral";
}

const StatsCard = ({ icon: Icon, label, value, subtitle, color = "cyan", trend }: StatsCardProps) => {
  const colorClasses = {
    cyan: "text-primary border-primary/30 shadow-[0_0_20px_hsl(193_100%_50%_/_0.2)]",
    purple: "text-secondary border-secondary/30 shadow-[0_0_20px_hsl(280_80%_60%_/_0.2)]",
    pink: "text-accent border-accent/30 shadow-[0_0_20px_hsl(340_90%_65%_/_0.2)]",
    green: "text-green-400 border-green-400/30 shadow-[0_0_20px_hsl(142_76%_36%_/_0.2)]",
  };

  const bgGradients = {
    cyan: "from-primary/10 to-primary/5",
    purple: "from-secondary/10 to-secondary/5",
    pink: "from-accent/10 to-accent/5",
    green: "from-green-400/10 to-green-400/5",
  };

  return (
    <Card className={`border-2 backdrop-blur-sm bg-gradient-to-br ${bgGradients[color]} hover:scale-105 transition-all duration-300 ${colorClasses[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-card/50 border border-current/20 ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend === "up" ? "bg-green-400/20 text-green-400" :
              trend === "down" ? "bg-red-400/20 text-red-400" :
              "bg-muted/20 text-muted-foreground"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
          <div className="text-3xl font-bold">{value}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
