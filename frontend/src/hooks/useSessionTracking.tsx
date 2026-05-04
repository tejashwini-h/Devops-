import { useState, useEffect, useCallback } from "react";

export interface SessionData {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  blinkCount: number;
  avgBlinkRate: number;
  focusScore: number;
  eyeStrainLevel: number;
  gazeAwayCount: number;
  fatigueDetections: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export const useSessionTracking = (isMonitoring: boolean, blinkRate: number) => {
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  // Initialize from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("sessionHistory");
    const savedAchievements = localStorage.getItem("achievements");
    const savedStreak = localStorage.getItem("streak");
    const savedTotal = localStorage.getItem("totalSessions");

    if (savedHistory) setSessionHistory(JSON.parse(savedHistory));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedTotal) setTotalSessions(parseInt(savedTotal));
  }, []);

  // Start session
  useEffect(() => {
    if (isMonitoring && !currentSession) {
      const newSession: SessionData = {
        id: `session_${Date.now()}`,
        startTime: new Date(),
        duration: 0,
        blinkCount: 0,
        avgBlinkRate: 0,
        focusScore: 100,
        eyeStrainLevel: 0,
        gazeAwayCount: 0,
        fatigueDetections: 0,
      };
      setCurrentSession(newSession);
    } else if (!isMonitoring && currentSession) {
      // End session
      const endedSession = {
        ...currentSession,
        endTime: new Date(),
      };
      
      const updatedHistory = [endedSession, ...sessionHistory].slice(0, 30); // Keep last 30 sessions
      setSessionHistory(updatedHistory);
      localStorage.setItem("sessionHistory", JSON.stringify(updatedHistory));
      
      setTotalSessions(prev => {
        const newTotal = prev + 1;
        localStorage.setItem("totalSessions", newTotal.toString());
        checkAchievements(newTotal, endedSession);
        return newTotal;
      });
      
      setCurrentSession(null);
    }
  }, [isMonitoring]);

  // Update session data
  useEffect(() => {
    if (currentSession && isMonitoring) {
      const interval = setInterval(() => {
        setCurrentSession(prev => {
          if (!prev) return null;
          
          const newDuration = prev.duration + 1;
          const focusScore = Math.max(0, 100 - (prev.eyeStrainLevel * 10) - (prev.fatigueDetections * 5));
          
          return {
            ...prev,
            duration: newDuration,
            avgBlinkRate: blinkRate,
            focusScore,
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentSession, isMonitoring, blinkRate]);

  const recordBlink = useCallback(() => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return { ...prev, blinkCount: prev.blinkCount + 1 };
    });
  }, []);

  const recordFatigue = useCallback(() => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return { ...prev, fatigueDetections: prev.fatigueDetections + 1 };
    });
  }, []);

  const recordGazeAway = useCallback(() => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return { ...prev, gazeAwayCount: prev.gazeAwayCount + 1 };
    });
  }, []);

  const updateEyeStrain = useCallback((level: number) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return { ...prev, eyeStrainLevel: level };
    });
  }, []);

  const checkAchievements = (total: number, session: SessionData) => {
    const newAchievements: Achievement[] = [];

    if (total === 1) {
      newAchievements.push({
        id: "first_session",
        title: "First Steps",
        description: "Completed your first monitoring session",
        icon: "👁️",
        unlockedAt: new Date(),
      });
    }

    if (total === 10) {
      newAchievements.push({
        id: "ten_sessions",
        title: "Dedicated Protector",
        description: "Completed 10 monitoring sessions",
        icon: "🏆",
        unlockedAt: new Date(),
      });
    }

    if (session.focusScore >= 90) {
      newAchievements.push({
        id: "perfect_focus",
        title: "Eagle Eye",
        description: "Achieved 90+ focus score",
        icon: "🦅",
        unlockedAt: new Date(),
      });
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => {
        const updated = [...prev, ...newAchievements];
        localStorage.setItem("achievements", JSON.stringify(updated));
        return updated;
      });
    }
  };

  return {
    currentSession,
    sessionHistory,
    achievements,
    streak,
    totalSessions,
    recordBlink,
    recordFatigue,
    recordGazeAway,
    updateEyeStrain,
  };
};
