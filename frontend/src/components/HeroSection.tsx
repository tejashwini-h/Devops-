import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-eye.jpg";

const HeroSection = ({ onStartMonitoring }: { onStartMonitoring: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(193_100%_50%_/_0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(280_80%_60%_/_0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(340_90%_65%_/_0.1),transparent_50%)]" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20">
              <Eye className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="text-sm text-muted-foreground">AI-Powered Eye Health</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                NeuroLens
              </span>
              <br />
              <span className="text-foreground">
                Your Digital Eye Guardian
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Real-time blink detection, intelligent reminders, and the 20-20-20 rule - all powered by your webcam. 
              Protect your eyes while crushing your screen time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onStartMonitoring}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_hsl(193_100%_50%_/_0.3)] hover:shadow-[0_0_50px_hsl(193_100%_50%_/_0.5)] transition-all duration-300"
              >
                Start Monitoring
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 backdrop-blur-sm px-8 py-6 text-lg rounded-xl transition-all duration-300"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: "99.9%", label: "Accuracy" },
                { value: "< 100ms", label: "Latency" },
                { value: "24/7", label: "Protection" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="NeuroLens AI Eye Tracking Technology"
              className="relative rounded-3xl shadow-2xl border border-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-primary animate-glow-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
