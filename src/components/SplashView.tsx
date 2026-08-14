import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

interface SplashViewProps {
  onComplete: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onComplete }) => {
  useEffect(() => {
    // Total Duration: 2 Seconds (2000 ms) as strictly requested
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-[#0F1115] flex flex-col justify-between items-center px-6 py-12 select-none relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div></div>

      {/* Center Branding: Fade + Scale Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.0,
          ease: [0.16, 1, 0.3, 1] // FastOutSlowIn / Spring easing
        }}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-6">
          <Truck className="w-10 h-10 text-[#00E5FF]" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-wider text-white font-sans">
          RexGo
        </h1>

        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-slate-400">
          Native Courier Logistics
        </p>

        {/* 120Hz Fast Pulse Loader */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/40"></span>
        </div>
      </motion.div>

      {/* Bottom Powered By */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex flex-col items-center text-center z-10 mb-4"
      >
        <span className="text-xs text-slate-500 tracking-wide font-normal">
          Powered by
        </span>
        <span className="text-sm font-semibold text-[#00E5FF] tracking-wide mt-0.5">
          Myo Thant Zaw
        </span>
      </motion.div>
    </div>
  );
};
