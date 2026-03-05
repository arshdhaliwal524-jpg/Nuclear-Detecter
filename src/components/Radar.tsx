import React from 'react';
import { motion } from 'motion/react';

export default function Radar({ active = false }: { active?: boolean }) {
  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      {/* Background Rings */}
      <div className="absolute inset-0 border border-white/10 rounded-full" />
      <div className="absolute inset-[15%] border border-white/10 rounded-full" />
      <div className="absolute inset-[30%] border border-white/10 rounded-full" />
      <div className="absolute inset-[45%] border border-white/10 rounded-full" />
      
      {/* Crosshairs */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10" />

      {/* Scanning Line */}
      <div className="absolute inset-0 radar-scan origin-center">
        <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-red-500/20 to-transparent origin-bottom-left -rotate-90" />
        <div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-red-500 shadow-[0_0_15px_rgba(255,68,68,0.8)]" />
      </div>

      {/* Threat Markers (Simulated) */}
      {active && (
        <>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute top-[20%] left-[35%] w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ff4444]"
          >
            <div className="absolute -top-6 -left-4 text-[10px] font-bold text-red-500 whitespace-nowrap">
              OBJ_ID: ICBM-772<br/>
              ALT: 45,000m
            </div>
          </motion.div>
          
          <div className="absolute top-[20%] left-[35%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 border border-red-500/30 rounded-full radar-pulse" />
        </>
      )}

      {/* Center Point */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-[0_0_10px_white]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] mt-4 font-bold text-white/50 uppercase tracking-tighter">
        USER_LOC
      </div>
    </div>
  );
}
