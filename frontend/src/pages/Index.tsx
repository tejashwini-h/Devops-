import { useState, useEffect, useCallback } from "react";
import { Activity, Eye, Clock, TrendingUp } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import WebcamMonitor from "@/components/WebcamMonitor";
import BlinkCounter from "@/components/BlinkCounter";
import SessionTimer from "@/components/SessionTimer";
import StatsCard from "@/components/StatsCard";
import ReminderSettings from "@/components/ReminderSettings";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import SessionReport from "@/components/SessionReport";
import GamificationDashboard from "@/components/GamificationDashboard";
import FatigueDetector from "@/components/FatigueDetector";
import { toast } from "@/hooks/use-toast";
import { useHealthReminders } from "@/hooks/useHealthReminders";
import { useSessionTracking } from "@/hooks/useSessionTracking";

// Define the structure for the data we expect from the webcam component
interface BlinkData {
  count: number;
  rate: number; // Blinks per minute (BPM)
}

const Index = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [blinkCount, setBlinkCount] = useState(0);
  const [blinkRate, setBlinkRate] = useState(17); // Default healthy rate
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [nightModeEnabled, setNightModeEnabled] = useState(false);

  // Session tracking hook
  const {
    currentSession,
    sessionHistory,
    achievements,
    streak,
    totalSessions,
    recordBlink,
    recordFatigue,
    recordGazeAway,
    updateEyeStrain,
  } = useSessionTracking(isMonitoring, blinkRate);

  // Health reminders hook
  useHealthReminders({
    isMonitoring,
    notificationsEnabled,
    soundEnabled,
    blinkRate,
  });

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
        }
      });
    }
  }, []);

  // ✅ UPDATED: Eye strain and rate-based logic, runs only when monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const rateInterval = setInterval(() => {
      // Logic for calculating eye strain based on the current blinkRate state
      if (currentSession) {
        const strainLevel = Math.min(
          10,
          Math.floor((currentSession.duration / 600) + (blinkRate < 15 ? 2 : 0))
        );
        updateEyeStrain(strainLevel);
      }
    }, 10000);

    return () => clearInterval(rateInterval);
    // Dependencies are correct here
  }, [isMonitoring, currentSession, blinkRate, updateEyeStrain]);

  // ✅ FINAL FIX for callback stability and correct state usage
  const handleBlinkData = useCallback((data: BlinkData) => {
    
    // 1. Always update the stable blinkRate
    setBlinkRate(data.rate);

    // 2. Use functional update for blinkCount to avoid stale closure issues
    setBlinkCount(prevCount => {
      const newCount = data.count;

      // Only record a blink if the count has actually increased (WebcamMonitor sends the current total)
      // and if monitoring is active (to avoid recording blinks before the session officially starts)
      if (isMonitoring && newCount > prevCount) {
          recordBlink(); 
      }
      return newCount; // Always return the count received from the webcam
    });
    
    // ❌ Removed blinkCount from dependency array for stability
    // ✅ Kept isMonitoring to ensure recordBlink only fires during an active session
  }, [isMonitoring, recordBlink]); 

  const handleStartMonitoring = () => {
    setShowHero(false);
    setIsMonitoring(true);
    toast({
      title: "Monitoring started",
      description: "Your eye health is now being tracked",
    });
  };

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const handleResetTimer = () => {
    toast({
      title: "Timer reset",
      description: "Session timer has been reset to 00:00:00",
    });
  };

  const handleToggleNotifications = () => {
    if (!notificationsEnabled && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
          toast({
            title: "Notifications enabled",
            description: "You'll receive break reminders",
          });
        }
      });
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  if (showHero) {
    return <HeroSection onStartMonitoring={handleStartMonitoring} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(193_100%_50%_/_0.3)]">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  NeuroLens
                </h1>
                <p className="text-xs text-muted-foreground">Eye Health Monitor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-primary animate-glow-pulse" : "bg-muted"}`} />
                <span className="text-xs font-medium">
                  {isMonitoring ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Webcam Monitor */}
          <section className="animate-slide-up">
            <WebcamMonitor 
              isActive={isMonitoring} 
              onToggle={handleToggleMonitoring} 
              onBlinkData={handleBlinkData} 
            />
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <StatsCard
              icon={Eye}
              label="Eye Focus Score"
              value="94%"
              subtitle="Excellent"
              color="cyan"
              trend="up"
            />
            <StatsCard
              icon={Activity}
              label="Avg. Session"
              value="2.5h"
              subtitle="Today"
              color="purple"
              trend="neutral"
            />
            <StatsCard
              icon={Clock}
              label="Break Compliance"
              value="87%"
              subtitle="This week"
              color="pink"
              trend="up"
            />
            <StatsCard
              icon={TrendingUp}
              label="Health Trend"
              value="+12%"
              subtitle="vs last week"
              color="green"
              trend="up"
            />
          </section>

          {/* Monitoring Dashboard */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <BlinkCounter count={blinkCount} rate={blinkRate} />
            <SessionTimer isActive={isMonitoring} onReset={handleResetTimer} />
            <ReminderSettings
              notificationsEnabled={notificationsEnabled}
              soundEnabled={soundEnabled}
              nightModeEnabled={nightModeEnabled}
              onToggleNotifications={handleToggleNotifications}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              onToggleNightMode={() => setNightModeEnabled(!nightModeEnabled)}
            />
          </section>

          {/* Analytics Dashboard */}
          <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <AnalyticsDashboard />
          </section>

          {/* Session Report & Gamification */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <SessionReport 
              currentSession={currentSession} 
              sessionHistory={sessionHistory}
            />
            <GamificationDashboard
              achievements={achievements}
              streak={streak}
              totalSessions={totalSessions}
              focusScore={currentSession?.focusScore || 0}
            />
          </section>
        </div>
      </main>

      {/* Fatigue Detector (Background Logic) */}
      <FatigueDetector
        blinkRate={blinkRate}
        isMonitoring={isMonitoring}
        onFatigueDetected={recordFatigue}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>NeuroLens - Protecting your digital eye health</p>
            <p className="mt-2">Powered by WebRTC & AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
