import { Card } from "@/components/ui/card";
import { Trophy, Award, Flame, Star, Target } from "lucide-react";
import { Achievement } from "@/hooks/useSessionTracking";

interface GamificationDashboardProps {
  achievements: Achievement[];
  streak: number;
  totalSessions: number;
  focusScore: number;
}

const GamificationDashboard = ({
  achievements,
  streak,
  totalSessions,
  focusScore,
}: GamificationDashboardProps) => {
  const allAchievements: Achievement[] = [
    {
      id: "first_session",
      title: "First Steps",
      description: "Complete your first monitoring session",
      icon: "👁️",
    },
    {
      id: "ten_sessions",
      title: "Dedicated Protector",
      description: "Complete 10 monitoring sessions",
      icon: "🏆",
    },
    {
      id: "perfect_focus",
      title: "Eagle Eye",
      description: "Achieve 90+ focus score",
      icon: "🦅",
    },
    {
      id: "week_streak",
      title: "Weekly Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
    },
    {
      id: "blink_master",
      title: "Blink Master",
      description: "Maintain healthy blink rate for 5 sessions",
      icon: "✨",
    },
  ];

  const unlockedIds = achievements.map(a => a.id);

  return (
    <Card className="glass-card p-6 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Your Progress</h3>
          <p className="text-sm text-muted-foreground">Achievements & milestones</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-4 rounded-lg border border-orange-500/20 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20 text-center">
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalSessions}</p>
          <p className="text-xs text-muted-foreground">Sessions</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20 text-center">
          <Star className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{focusScore}%</p>
          <p className="text-xs text-muted-foreground">Focus Score</p>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Achievements
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                    : "bg-card/30 border-border/50 opacity-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm mb-1">
                      {achievement.title}
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    {isUnlocked && achievement.unlockedAt && (
                      <p className="text-xs text-amber-500 mt-2">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {isUnlocked && (
                    <Trophy className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default GamificationDashboard;
