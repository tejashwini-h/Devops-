import { Bell, Volume2, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ReminderSettingsProps {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  nightModeEnabled: boolean;
  onToggleNotifications: () => void;
  onToggleSound: () => void;
  onToggleNightMode: () => void;
}

const ReminderSettings = ({
  notificationsEnabled,
  soundEnabled,
  nightModeEnabled,
  onToggleNotifications,
  onToggleSound,
  onToggleNightMode,
}: ReminderSettingsProps) => {
  return (
    <Card className="border-2 border-accent/30 backdrop-blur-sm bg-gradient-to-br from-accent/10 to-accent/5 shadow-[0_0_30px_hsl(340_90%_65%_/_0.2)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-accent" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-card/30 border border-accent/10 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Bell className="w-4 h-4 text-accent" />
            </div>
            <div>
              <Label htmlFor="notifications" className="font-medium cursor-pointer">
                Browser Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Get reminders even in other tabs
              </p>
            </div>
          </div>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={onToggleNotifications}
          />
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-card/30 border border-accent/10 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Volume2 className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <Label htmlFor="sound" className="font-medium cursor-pointer">
                Sound Alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Play sound with reminders
              </p>
            </div>
          </div>
          <Switch
            id="sound"
            checked={soundEnabled}
            onCheckedChange={onToggleSound}
          />
        </div>

        {/* Night Mode */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-card/30 border border-accent/10 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Moon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <Label htmlFor="nightmode" className="font-medium cursor-pointer">
                Reduced Alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Fewer reminders at night
              </p>
            </div>
          </div>
          <Switch
            id="nightmode"
            checked={nightModeEnabled}
            onCheckedChange={onToggleNightMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;
