import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Radio,
  Users,
  QrCode,
  Settings,
  Truck,
  RotateCw,
  Sparkles,
  ScanLine,
  UploadCloud,
  ChevronRight,
  Map,
  Bot,
  Compass,
  Navigation,
  Download,
  Smartphone
} from 'lucide-react';
import { UserSessionState, Customer, DeliveryParcel } from '../types';
import { InstallAppModal } from './InstallAppModal';

interface HomeViewProps {
  session: UserSessionState;
  scanCount: number;
  customers: Customer[];
  deliveries: DeliveryParcel[];
  onNavigateToSettings: () => void;
  onNavigateToScanner: () => void;
  onNavigateToCustomers: () => void;
  onNavigateToTodayDelivery: () => void;
  onNavigateToImport: () => void;
  onNavigateToMapRoute?: () => void;
  onNavigateToAIAssistant?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  session,
  scanCount,
  customers,
  deliveries,
  onNavigateToSettings,
  onNavigateToScanner,
  onNavigateToCustomers,
  onNavigateToTodayDelivery,
  onNavigateToImport,
  onNavigateToMapRoute,
  onNavigateToAIAssistant
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter(d => d.status === 'Completed').length;
  const remainingDeliveries = deliveries.filter(d => d.status === 'Pending').length;

  return (
    <div className="w-full h-full bg-[#0F1115] text-slate-100 flex flex-col justify-between overflow-y-auto select-none">
      
      {/* Top App Bar */}
      <div className="sticky top-0 bg-[#0F1115]/95 backdrop-blur-md px-5 py-3 border-b border-slate-800/80 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-none">RexGo Hub</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Courier Operations & AI Routing</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Install App Quick Action */}
          <button
            onClick={() => setShowInstallModal(true)}
            className="p-2 rounded-xl text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1 text-xs font-bold"
            title="Install Mobile App"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Install</span>
          </button>

          {/* AI Assistant Quick Header Icon */}
          <button
            onClick={onNavigateToAIAssistant}
            className="p-2 rounded-xl text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all relative"
            title="RexGo AI Assistant"
          >
            <Bot className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1 right-1 animate-pulse"></span>
          </button>

          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all ${
              isRefreshing ? 'animate-spin text-cyan-400' : ''
            }`}
            title="Refresh"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onNavigateToSettings}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-3.5">
        
        {/* Rider Status Card */}
        <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[11px] font-medium text-slate-400">မင်္ဂလာပါ တာဝန်ကျ Rider</p>
              <h3 className="text-base font-bold text-cyan-400 mt-0.5">
                {session.employeeId || 'RG-Rider #001'}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online Ready</span>
            </div>
          </div>
        </div>

        {/* Phase 4: Route Optimization & Smart Map Feature Banner */}
        <div
          onClick={onNavigateToMapRoute}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all group shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5 text-emerald-400 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>40+ Parcels လမ်းကြောင်း စီစဉ်ရန် (TSP Map)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-black text-[9px] font-extrabold">Auto Route</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Nearest-Neighbor Algorithm • အချိန်နှင့် ဆီစား သက်သာစေမည်
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Quick Launch OCR Scanner Banner */}
        <div
          onClick={onNavigateToScanner}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/40 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-all group shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>ပါဆယ် စကင်ဖတ်ရန် (CameraX OCR)</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black text-[9px] font-extrabold">Scan</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Printed & Handwritten OCR • Gemini Vision AI
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all">
            Scan
          </button>
        </div>

        {/* Small AI Assistant & Batch Import Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={onNavigateToAIAssistant}
            className="p-3 rounded-xl bg-[#141822] hover:bg-[#1A202E] border border-cyan-500/30 flex items-center justify-between cursor-pointer transition-all text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-white text-xs">AI Assistant</h5>
                <p className="text-[10px] text-slate-400">Gemini 2.5 Flash</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div
            onClick={onNavigateToImport}
            className="p-3 rounded-xl bg-[#141822] hover:bg-[#1A202E] border border-slate-800 flex items-center justify-between cursor-pointer transition-all text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-white text-xs">Batch Import</h5>
                <p className="text-[10px] text-slate-400">CSV & JSON Parser</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between px-1 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            လုပ်ငန်း အခြေအနေ (Operations & Database)
          </h4>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Phase 4 Live
          </span>
        </div>

        {/* 6 Dashboard Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Card 1: Today's Parcels */}
          <div
            onClick={onNavigateToTodayDelivery}
            className="bg-[#181B22] hover:bg-[#1E232E] border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-3.5 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400">
                View All
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">{totalDeliveries}</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Today's Parcels</p>
              <p className="text-[10px] text-slate-500">ယနေ့ ပါဆယ်စုစုပေါင်း</p>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div
            onClick={onNavigateToTodayDelivery}
            className="bg-[#181B22] hover:bg-[#1E232E] border border-slate-800/90 hover:border-emerald-500/40 rounded-2xl p-3.5 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                Done
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">{completedDeliveries}</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Completed</p>
              <p className="text-[10px] text-slate-500">ပို့ဆောင်ပြီးစီး</p>
            </div>
          </div>

          {/* Card 3: Remaining */}
          <div
            onClick={onNavigateToTodayDelivery}
            className="bg-[#181B22] hover:bg-[#1E232E] border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-3.5 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400">
                Queue
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">{remainingDeliveries}</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Remaining</p>
              <p className="text-[10px] text-slate-500">ကျန်ရှိနေသော ပါဆယ်</p>
            </div>
          </div>

          {/* Card 4: Map & Route Planning */}
          <div
            onClick={onNavigateToMapRoute}
            className="bg-[#181B22] hover:bg-[#1E232E] border border-slate-800/90 hover:border-emerald-500/40 rounded-2xl p-3.5 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Map className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                TSP Route
              </span>
            </div>
            <div className="mt-3">
              <span className="text-lg font-bold text-white tracking-tight">Auto Map</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Route Plan</p>
              <p className="text-[10px] text-slate-500">40+ လမ်းကြောင်း စီစဉ်ရန်</p>
            </div>
          </div>

          {/* Card 5: Customers Directory */}
          <div
            onClick={onNavigateToCustomers}
            className="bg-[#181B22] hover:bg-[#1E232E] border border-slate-800/90 hover:border-purple-500/40 rounded-2xl p-3.5 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400">
                Directory
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">{customers.length}</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Customers</p>
              <p className="text-[10px] text-slate-500">ဖောက်သည်စာရင်း (Search)</p>
            </div>
          </div>

          {/* Card 6: Today's Scan */}
          <div
            onClick={onNavigateToScanner}
            className="bg-[#181B22] hover:bg-[#1E232E] border border-cyan-500/40 rounded-2xl p-3.5 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-500 text-black font-bold">
                Scan
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-cyan-400 tracking-tight">{scanCount}</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Today's Scan</p>
              <p className="text-[10px] text-slate-500">စကင်ဖတ်ရန် နှိပ်ပါ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding & Install CTA */}
      <div className="p-4 text-center border-t border-slate-800/60 mt-auto flex flex-col items-center gap-2">
        <button
          onClick={() => setShowInstallModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-emerald-500/15 to-cyan-500/15 hover:from-cyan-500/25 hover:to-emerald-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>ဖုန်းထဲသို့ App ထည့်သွင်းရန် နှိပ်ပါ (Install App)</span>
        </button>
        <p className="text-[11px] text-slate-500">RexGo v1.0.0 (Phase 4 Gemini Vision & Route Planning)</p>
        <p className="text-xs font-semibold text-cyan-400">Powered by Myo Thant Zaw</p>
      </div>

      {/* App Installation / Build Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};

