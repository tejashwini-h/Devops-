import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, Eye, Clock, Zap } from "lucide-react";
import { SessionData } from "@/hooks/useSessionTracking";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import { toast } from "@/hooks/use-toast";

interface SessionReportProps {
  currentSession: SessionData | null;
  sessionHistory: SessionData[];
}

const SessionReport = ({ currentSession, sessionHistory }: SessionReportProps) => {
  const handleExportCSV = () => {
    if (sessionHistory.length === 0) {
      toast({
        title: "No data to export",
        description: "Complete at least one session to export data",
        variant: "destructive",
      });
      return;
    }
    exportToCSV(sessionHistory);
    toast({
      title: "CSV exported",
      description: "Your session data has been downloaded",
    });
  };

  const handleExportPDF = () => {
    if (sessionHistory.length === 0) {
      toast({
        title: "No data to export",
        description: "Complete at least one session to export data",
        variant: "destructive",
      });
      return;
    }
    exportToPDF(sessionHistory);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const getRecommendations = (session: SessionData | null) => {
    if (!session) return [];
    
    const recommendations = [];
    
    if (session.avgBlinkRate < 12) {
      recommendations.push("Increase blink frequency - try the 20-20-20 rule");
    }
    if (session.eyeStrainLevel > 5) {
      recommendations.push("Reduce screen brightness and take more breaks");
    }
    if (session.focusScore < 70) {
      recommendations.push("Maintain better posture and minimize distractions");
    }
    if (session.fatigueDetections > 3) {
      recommendations.push("Get adequate sleep and take longer breaks");
    }
    
    return recommendations;
  };

  return (
    <Card className="glass-card p-6 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Session Report</h3>
            <p className="text-sm text-muted-foreground">Detailed insights & analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      {currentSession ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Duration</span>
              </div>
              <p className="text-xl font-bold">{formatDuration(currentSession.duration)}</p>
            </div>
            <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/10">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-secondary" />
                <span className="text-xs text-muted-foreground">Blink Rate</span>
              </div>
              <p className="text-xl font-bold">{currentSession.avgBlinkRate}/min</p>
            </div>
            <div className="bg-accent/5 p-4 rounded-lg border border-accent/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Focus Score</span>
              </div>
              <p className="text-xl font-bold">{currentSession.focusScore}%</p>
            </div>
            <div className="bg-pink-500/5 p-4 rounded-lg border border-pink-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-pink-500" />
                <span className="text-xs text-muted-foreground">Eye Strain</span>
              </div>
              <p className="text-xl font-bold">{currentSession.eyeStrainLevel}/10</p>
            </div>
          </div>

          <div className="bg-card/50 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {getRecommendations(currentSession).map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
              {getRecommendations(currentSession).length === 0 && (
                <li className="text-sm text-green-400">
                  ✓ Great job! Your eye health metrics are optimal
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Start monitoring to generate session reports</p>
        </div>
      )}
    </Card>
  );
};

export default SessionReport;
