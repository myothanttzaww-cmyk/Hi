import React from 'react';
import { Wifi, BatteryMedium, Cpu, Layers } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  currentTime: string;
  isFramed: boolean;
  onToggleFrame: () => void;
  onOpenArchitecture: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  currentTime,
  isFramed,
  onToggleFrame,
  onOpenArchitecture
}) => {
  if (!isFramed) {
    return (
      <div className="w-full min-h-screen bg-[#0F1115] text-slate-100 flex flex-col">
        {/* Top Controls Bar */}
        <header className="bg-[#181B22] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
            <span className="font-semibold text-sm tracking-wide text-white">RexGo Native Android</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
              v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenArchitecture}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Architecture & Source Code
            </button>
            <button
              onClick={onToggleFrame}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-medium text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              Switch to Redmi Turbo 4 Pro Frame
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] py-6 px-4 flex flex-col items-center justify-center font-sans antialiased text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Header Bar */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">RexGo Native Delivery</h1>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                Phase 1 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Redmi Turbo 4 Pro • Snapdragon 8s Gen 4 • 12GB RAM • 120Hz AMOLED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenArchitecture}
            className="px-3.5 py-1.5 rounded-xl bg-[#181B22] hover:bg-[#222733] text-xs font-medium text-cyan-300 border border-slate-700/80 flex items-center gap-2 transition-all shadow-sm"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Architecture & Code</span>
          </button>
          <button
            onClick={onToggleFrame}
            className="px-3.5 py-1.5 rounded-xl bg-[#181B22] hover:bg-[#222733] text-xs font-medium text-slate-300 border border-slate-700/80 transition-all"
          >
            Fullscreen View
          </button>
        </div>
      </div>

      {/* Phone Mockup (Redmi Turbo 4 Pro styling) */}
      <div className="relative w-[380px] h-[780px] bg-[#0F1115] rounded-[48px] border-[6px] border-[#222733] shadow-[0_25px_60px_-15px_rgba(0,229,255,0.12)] ring-1 ring-slate-800/80 flex flex-col overflow-hidden">
        
        {/* Status Bar */}
        <div className="h-9 px-6 bg-transparent flex items-center justify-between text-xs text-slate-300 font-medium z-40 select-none">
          <span className="tracking-tight text-[13px] text-white font-semibold">{currentTime}</span>
          
          {/* Punch Hole Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-[#050608] border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-900/50"></div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-bold tracking-wider text-cyan-400">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* 120Hz Indicator Badge */}
        <div className="absolute top-10 right-4 z-30 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-cyan-400">
            120 Hz
          </span>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-hidden flex flex-col relative bg-[#0F1115]">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="h-5 bg-transparent flex items-center justify-center z-40 select-none pb-1">
          <div className="w-28 h-1 rounded-full bg-slate-600/60"></div>
        </div>
      </div>

      {/* Footer Powered By */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          RexGo Native Android • <span className="text-cyan-400 font-medium">Powered by Myo Thant Zaw</span>
        </p>
      </div>
    </div>
  );
};
