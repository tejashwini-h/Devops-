import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Activity, Clock, AlertTriangle } from "lucide-react";

// Sample data - replace with real data from your monitoring system
const blinkRateData = [
  { time: "10:00", rate: 18, healthy: 17 },
  { time: "10:20", rate: 16, healthy: 17 },
  { time: "10:40", rate: 14, healthy: 17 },
  { time: "11:00", rate: 12, healthy: 17 },
  { time: "11:20", rate: 15, healthy: 17 },
  { time: "11:40", rate: 19, healthy: 17 },
  { time: "12:00", rate: 17, healthy: 17 },
  { time: "12:20", rate: 16, healthy: 17 },
];

const screenTimeData = [
  { day: "Mon", hours: 6.5, breaks: 8 },
  { day: "Tue", hours: 7.2, breaks: 6 },
  { day: "Wed", hours: 5.8, breaks: 9 },
  { day: "Thu", hours: 8.1, breaks: 5 },
  { day: "Fri", hours: 6.9, breaks: 7 },
  { day: "Sat", hours: 4.2, breaks: 10 },
  { day: "Sun", hours: 3.5, breaks: 12 },
];

const eyeStrainData = [
  { time: "9:00", strain: 10, comfort: 90 },
  { time: "10:00", strain: 20, comfort: 80 },
  { time: "11:00", strain: 35, comfort: 65 },
  { time: "12:00", strain: 45, comfort: 55 },
  { time: "13:00", strain: 30, comfort: 70 },
  { time: "14:00", strain: 50, comfort: 50 },
  { time: "15:00", strain: 60, comfort: 40 },
  { time: "16:00", strain: 55, comfort: 45 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-xl border-2 border-primary/30 rounded-xl p-4 shadow-[0_0_30px_hsl(193_100%_50%_/_0.3)]">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
            {entry.unit && <span className="text-muted-foreground"> {entry.unit}</span>}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">Track your eye health metrics over time</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Last 7 days</span>
        </div>
      </div>

      {/* Blink Rate Chart */}
      <Card className="border-2 border-primary/30 backdrop-blur-sm bg-gradient-to-br from-card/80 to-card/40 shadow-[0_0_30px_hsl(193_100%_50%_/_0.15)] hover:shadow-[0_0_40px_hsl(193_100%_50%_/_0.25)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-lg">Blink Rate Tracking</div>
              <div className="text-sm text-muted-foreground font-normal">
                Blinks per minute - Healthy range: 15-20
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={blinkRateData}>
              <defs>
                <linearGradient id="blinkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="healthyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="healthy" 
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Healthy Rate"
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="hsl(193, 100%, 50%)" 
                strokeWidth={3}
                dot={{ fill: "hsl(193, 100%, 50%)", r: 4 }}
                activeDot={{ r: 6, fill: "hsl(193, 100%, 50%)", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                name="Your Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Screen Time Chart */}
        <Card className="border-2 border-secondary/30 backdrop-blur-sm bg-gradient-to-br from-card/80 to-card/40 shadow-[0_0_30px_hsl(280_80%_60%_/_0.15)] hover:shadow-[0_0_40px_hsl(280_80%_60%_/_0.25)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/30">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-lg">Weekly Screen Time</div>
                <div className="text-sm text-muted-foreground font-normal">
                  Daily hours & break frequency
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={screenTimeData}>
                <defs>
                  <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="breaksGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(340, 90%, 65%)" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="hsl(340, 90%, 65%)" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="hours" 
                  fill="url(#hoursGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Screen Time (hrs)"
                />
                <Bar 
                  dataKey="breaks" 
                  fill="url(#breaksGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Breaks Taken"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Eye Strain Chart */}
        <Card className="border-2 border-accent/30 backdrop-blur-sm bg-gradient-to-br from-card/80 to-card/40 shadow-[0_0_30px_hsl(340_90%_65%_/_0.15)] hover:shadow-[0_0_40px_hsl(340_90%_65%_/_0.25)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                <AlertTriangle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-lg">Eye Strain Index</div>
                <div className="text-sm text-muted-foreground font-normal">
                  Strain vs comfort levels today
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={eyeStrainData}>
                <defs>
                  <linearGradient id="strainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(340, 90%, 65%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(340, 90%, 65%)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Area 
                  type="monotone" 
                  dataKey="comfort" 
                  stroke="hsl(142, 76%, 36%)" 
                  fill="url(#comfortGradient)"
                  strokeWidth={2}
                  name="Comfort Level (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="strain" 
                  stroke="hsl(340, 90%, 65%)" 
                  fill="url(#strainGradient)"
                  strokeWidth={2}
                  name="Strain Level (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
