import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

interface HealthRemindersProps {
  isMonitoring: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  blinkRate: number;
}

const HEALTH_TIPS = [
  "💧 Stay hydrated! Drinking water helps maintain tear production and reduces dry eyes.",
  "🌙 Reduce blue light exposure before bed for better sleep quality.",
  "✨ Blink more often! Blinking spreads tears evenly across your eyes.",
  "🎯 Position your screen 20-26 inches away from your eyes.",
  "💡 Ensure proper lighting to reduce glare on your screen.",
  "🧘 Take regular breaks to prevent digital eye fatigue.",
  "👀 Adjust screen brightness to match your surroundings.",
  "🌿 Add plants to your workspace to improve air quality and reduce eye dryness.",
];

const playNotificationSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

export const useHealthReminders = ({
  isMonitoring,
  notificationsEnabled,
  soundEnabled,
  blinkRate,
}: HealthRemindersProps) => {
  const twentyTwentyInterval = useRef<NodeJS.Timeout>();
  const lastBlinkRateCheck = useRef<number>(0);
  const tipsInterval = useRef<NodeJS.Timeout>();

  const sendNotification = (title: string, body: string, icon?: string) => {
    // Show toast notification
    toast({
      title,
      description: body,
    });

    // Show browser notification if enabled
    if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: icon || "/favicon.ico",
        badge: "/favicon.ico",
        tag: "neurolens-health",
      });
    }

    // Play sound if enabled
    if (soundEnabled) {
      playNotificationSound();
    }
  };

  // 20-20-20 Rule Reminder
  useEffect(() => {
    if (!isMonitoring) {
      if (twentyTwentyInterval.current) {
        clearInterval(twentyTwentyInterval.current);
      }
      return;
    }

    twentyTwentyInterval.current = setInterval(() => {
      sendNotification(
        "⏰ Time for a 20-20-20 Break!",
        "Look at something 20 feet away for 20 seconds to reduce eye strain and relax your eye muscles."
      );
    }, 20 * 60 * 1000); // Every 20 minutes

    return () => {
      if (twentyTwentyInterval.current) {
        clearInterval(twentyTwentyInterval.current);
      }
    };
  }, [isMonitoring, notificationsEnabled, soundEnabled]);

  // Low Blink Rate Detection
  useEffect(() => {
    if (!isMonitoring) return;

    const now = Date.now();
    const timeSinceLastCheck = now - lastBlinkRateCheck.current;

    // Check every 30 seconds
    if (timeSinceLastCheck < 30000) return;

    lastBlinkRateCheck.current = now;

    // Normal blink rate is 15-20 per minute
    if (blinkRate < 12) {
      sendNotification(
        "👁️ Low Blink Rate Detected!",
        `Your blink rate is ${blinkRate}/min. Remember to blink more frequently to prevent dry eyes and maintain eye moisture.`
      );
    }
  }, [blinkRate, isMonitoring, notificationsEnabled, soundEnabled]);

  // Random Health Tips
  useEffect(() => {
    if (!isMonitoring) {
      if (tipsInterval.current) {
        clearInterval(tipsInterval.current);
      }
      return;
    }

    tipsInterval.current = setInterval(() => {
      const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
      sendNotification("💡 Eye Health Tip", randomTip);
    }, 30 * 60 * 1000); // Every 30 minutes

    return () => {
      if (tipsInterval.current) {
        clearInterval(tipsInterval.current);
      }
    };
  }, [isMonitoring, notificationsEnabled, soundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (twentyTwentyInterval.current) clearInterval(twentyTwentyInterval.current);
      if (tipsInterval.current) clearInterval(tipsInterval.current);
    };
  }, []);
};
