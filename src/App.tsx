import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Activity, 
  MapPin, 
  Timer, 
  Zap, 
  Volume2, 
  VolumeX,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Radar from './components/Radar';
import AIAssistant from './components/AIAssistant';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isThreatActive, setIsThreatActive] = useState(false);
  const [threatData, setThreatData] = useState({
    speed: 0,
    timeToImpact: 0,
    location: "SCANNING...",
    distance: 0,
    yield: "UNKNOWN"
  });
  const [isMuted, setIsMuted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Audio for alarm
  const alarmRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Request location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  const triggerSimulation = useCallback(() => {
    setIsThreatActive(true);
    setThreatData({
      speed: 24500, // km/h
      timeToImpact: 180, // seconds
      location: "NORTHERN QUADRANT - SECTOR 7",
      distance: 1250, // km
      yield: "500KT"
    });

    if (!isMuted) {
      // In a real app we'd use a real sound file, here we simulate with a beep if possible
      // but browser restrictions might block auto-play.
      console.log("ALARM TRIGGERED");
    }
  }, [isMuted]);

  useEffect(() => {
    let interval: any;
    if (isThreatActive && threatData.timeToImpact > 0) {
      interval = setInterval(() => {
        setThreatData(prev => ({
          ...prev,
          timeToImpact: Math.max(0, prev.timeToImpact - 1),
          distance: Math.max(0, prev.distance - 6.8) // roughly speed based
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isThreatActive, threatData.timeToImpact]);

  return (
    <div className="min-h-screen bg-aegis-bg text-aegis-text p-4 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Aegis Monitor</h1>
          </div>
          <p className="text-aegis-muted text-xs mt-1 font-bold uppercase tracking-[0.2em]">
            Strategic Defense & Survival Network v4.0.2
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-aegis-muted uppercase font-bold">System Status</span>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              OPERATIONAL
            </span>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 glass-panel hover:bg-white/5 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Radar & Detection */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Live Radar Feed</span>
            </div>
            
            <Radar active={isThreatActive} />

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <StatCard 
                label="Velocity" 
                value={isThreatActive ? `${threatData.speed.toLocaleString()} km/h` : "---"} 
                icon={<Zap className="w-4 h-4" />}
                active={isThreatActive}
              />
              <StatCard 
                label="Impact Time" 
                value={isThreatActive ? `${Math.floor(threatData.timeToImpact / 60)}m ${threatData.timeToImpact % 60}s` : "---"} 
                icon={<Timer className="w-4 h-4" />}
                active={isThreatActive}
                critical={isThreatActive && threatData.timeToImpact < 60}
              />
              <StatCard 
                label="Distance" 
                value={isThreatActive ? `${threatData.distance.toFixed(1)} km` : "---"} 
                icon={<Activity className="w-4 h-4" />}
                active={isThreatActive}
              />
              <StatCard 
                label="Yield Est." 
                value={isThreatActive ? threatData.yield : "---"} 
                icon={<AlertTriangle className="w-4 h-4" />}
                active={isThreatActive}
              />
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-aegis-accent" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Target Analysis</h3>
              </div>
              {!isThreatActive && (
                <button 
                  onClick={triggerSimulation}
                  className="text-[10px] font-bold px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded hover:bg-red-500/20 transition-colors"
                >
                  RUN SIMULATION
                </button>
              )}
            </div>
            <div className="bg-black/40 rounded-lg p-4 font-mono text-xs leading-relaxed border border-white/5">
              <p className={isThreatActive ? "text-red-500 font-bold" : "text-aegis-muted"}>
                {isThreatActive 
                  ? `[CRITICAL] MULTIPLE THERMAL SIGNATURES DETECTED. TRAJECTORY CONFIRMED: ${threatData.location}. PROBABLE IMPACT POINT: ${location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'CALCULATING...'}`
                  : "[IDLE] NO THREATS DETECTED IN IMMEDIATE AIRSPACE. CONTINUING GLOBAL SCAN..."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 min-h-[500px]">
            <AIAssistant />
          </div>
          
          <div className="glass-panel p-4 bg-blue-950/10 border-blue-500/20">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase text-blue-400 mb-1">Emergency Notice</h4>
                <p className="text-[10px] text-blue-100/60 leading-tight">
                  This is a simulation dashboard. In a real emergency, follow official government instructions and seek immediate shelter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Critical Alert Overlay */}
      <AnimatePresence>
        {isThreatActive && threatData.timeToImpact < 60 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 border-[20px] border-red-500/30 animate-pulse"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon, active, critical }: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  active?: boolean;
  critical?: boolean;
}) {
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all duration-500",
      active ? "bg-white/5 border-white/10" : "bg-black/20 border-white/5 opacity-50",
      critical && "border-red-500 bg-red-500/10"
    )}>
      <div className="flex items-center gap-2 text-aegis-muted mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
      </div>
      <div className={cn(
        "text-lg font-black lcd-text",
        active ? (critical ? "text-red-500" : "text-white") : "text-white/20"
      )}>
        {value}
      </div>
    </div>
  );
}
