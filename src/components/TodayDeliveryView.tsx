import React, { useState, useMemo } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Ban,
  Phone,
  MapPin,
  Search,
  ScanLine,
  UploadCloud,
  Compass,
  DollarSign,
  ArrowLeft,
  ChevronDown,
  PhoneOff,
  Sparkles,
  RotateCcw,
  Check,
  AlertCircle,
  Map,
  Bot,
  Navigation
} from 'lucide-react';
import { DeliveryParcel, DeliveryStatus } from '../types';

interface TodayDeliveryViewProps {
  deliveries: DeliveryParcel[];
  onNavigateBack: () => void;
  onNavigateToScanner: () => void;
  onNavigateToImport: () => void;
  onNavigateToMapRoute?: () => void;
  onNavigateToAIAssistant?: () => void;
  onUpdateStatus: (id: string, status: DeliveryStatus) => void;
  onSelectDeliveryDetail?: (delivery: DeliveryParcel) => void;
}

export const TodayDeliveryView: React.FC<TodayDeliveryViewProps> = ({
  deliveries,
  onNavigateBack,
  onNavigateToScanner,
  onNavigateToImport,
  onNavigateToMapRoute,
  onNavigateToAIAssistant,
  onUpdateStatus,
  onSelectDeliveryDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'completed' | 'skipped'>('all');
  const [callingPhone, setCallingPhone] = useState<string | null>(null);

  // Filter deliveries
  const filteredDeliveries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryDigits = searchQuery.replace(/[^0-9]/g, '');

    return deliveries.filter(d => {
      // Tab filter
      if (selectedTab === 'pending' && d.status !== 'Pending') return false;
      if (selectedTab === 'completed' && d.status !== 'Completed') return false;
      if (selectedTab === 'skipped' && d.status !== 'Skipped') return false;

      if (!query) return true;

      if (d.customerName && d.customerName.toLowerCase().includes(query)) return true;
      if (d.trackingNo && d.trackingNo.toLowerCase().includes(query)) return true;
      if (d.address && d.address.toLowerCase().includes(query)) return true;
      if (d.township && d.township.toLowerCase().includes(query)) return true;
      if (queryDigits && d.normalizedPhone && d.normalizedPhone.includes(queryDigits)) return true;

      return false;
    });
  }, [deliveries, selectedTab, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = deliveries.length;
    const completed = deliveries.filter(d => d.status === 'Completed').length;
    const pending = deliveries.filter(d => d.status === 'Pending').length;
    const skipped = deliveries.filter(d => d.status === 'Skipped').length;
    const totalCod = deliveries
      .filter(d => d.status !== 'Skipped')
      .reduce((sum, d) => sum + (d.codAmount || 0), 0);
    const collectedCod = deliveries
      .filter(d => d.status === 'Completed')
      .reduce((sum, d) => sum + (d.codAmount || 0), 0);

    return { total, completed, pending, skipped, totalCod, collectedCod };
  }, [deliveries]);

  const handleCall = (phone?: string) => {
    if (!phone) return;
    setCallingPhone(phone);
    setTimeout(() => setCallingPhone(null), 2500);
  };

  const handleOpenMap = (d: DeliveryParcel) => {
    if (d.latitude && d.longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${d.latitude},${d.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address + ' ' + d.township)}`, '_blank');
    }
  };

  return (
    <div className="w-full h-full bg-[#0D0F14] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Top App Bar */}
      <div className="bg-[#12151D] px-4 py-3 border-b border-slate-800/90 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>ယနေ့ ပို့ဆောင်ရမည့်စာရင်း</span>
            </h2>
            <p className="text-[11px] text-slate-400">40+ Parcels Queue & Map Plan</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Map Route Plan Quick Button */}
          {onNavigateToMapRoute && (
            <button
              onClick={onNavigateToMapRoute}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-all"
              title="40+ Parcel Route Map"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Map Route</span>
            </button>
          )}

          <button
            onClick={onNavigateToScanner}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
            title="Scan Parcel"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="p-3 bg-[#12151D]/80 border-b border-slate-800/60 grid grid-cols-4 gap-2 shrink-0">
        <div className="p-2 rounded-xl bg-[#181C26] border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-medium">စုစုပေါင်း</span>
          <span className="text-base font-bold text-white font-mono">{stats.total}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#181C26] border border-amber-500/30 text-center">
          <span className="text-[10px] text-amber-400 block font-medium">ကျန်ရှိ</span>
          <span className="text-base font-bold text-amber-400 font-mono">{stats.pending}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#181C26] border border-emerald-500/30 text-center">
          <span className="text-[10px] text-emerald-400 block font-medium">ပြီးစီး</span>
          <span className="text-base font-bold text-emerald-400 font-mono">{stats.completed}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#181C26] border border-rose-500/30 text-center">
          <span className="text-[10px] text-rose-400 block font-medium">ကျော်ခွ</span>
          <span className="text-base font-bold text-rose-400 font-mono">{stats.skipped}</span>
        </div>
      </div>

      {/* Search & Tabs Header */}
      <div className="p-3 bg-[#10131B] border-b border-slate-800/60 space-y-2 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ဖောက်သည်အမည်၊ ဖုန်း၊ Tracking No၊ မြို့နယ်..."
            className="w-full h-9 pl-9 pr-8 rounded-xl bg-[#181C26] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              selectedTab === 'all'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
            }`}
          >
            အားလုံး ({deliveries.length})
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              selectedTab === 'pending'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ကျန် ({stats.pending})
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              selectedTab === 'completed'
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ပြီး ({stats.completed})
          </button>
          <button
            onClick={() => setSelectedTab('skipped')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              selectedTab === 'skipped'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ကျော် ({stats.skipped})
          </button>
        </div>
      </div>

      {/* Direct Call Toast */}
      {callingPhone && (
        <div className="p-2.5 bg-emerald-950 border-y border-emerald-500 text-emerald-300 text-xs flex items-center justify-between animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Native Android Intent: <strong>tel:{callingPhone}</strong></span>
          </div>
        </div>
      )}

      {/* Delivery Parcels List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredDeliveries.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4">
            <Package className="w-10 h-10 text-slate-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-300">ပါဆယ် စာရင်း မရှိပါ</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              ယနေ့ ပို့ဆောင်မည့် ပါဆယ်များ မရှိသေးပါ။ Scanner ဖြင့် ဖတ်၍သော်လည်းကောင်း၊ CSV/JSON ဖြင့် Import လုပ်၍သော်လည်းကောင်း ထည့်သွင်းနိုင်ပါသည်။
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={onNavigateToScanner}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs"
              >
                + Scan ဖတ်မည်
              </button>
              <button
                onClick={onNavigateToImport}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-400 font-bold text-xs border border-slate-700"
              >
                Batch Import
              </button>
            </div>
          </div>
        ) : (
          filteredDeliveries.map((parcel) => {
            const hasPhone = Boolean(parcel.phone || parcel.normalizedPhone);
            const isCompleted = parcel.status === 'Completed';
            const isSkipped = parcel.status === 'Skipped';

            return (
              <div
                key={parcel.id}
                className={`p-3 rounded-2xl border transition-all space-y-2.5 ${
                  isCompleted
                    ? 'bg-[#121915] border-emerald-500/30'
                    : isSkipped
                    ? 'bg-[#1C1214] border-rose-500/30 opacity-75'
                    : 'bg-[#151922] border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                {/* Tracking & Status Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-cyan-400 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                      {parcel.trackingNo}
                    </span>
                    {parcel.codAmount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        COD: {parcel.codAmount.toLocaleString()} Ks
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        Prepaid (ကြိုချေ)
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isSkipped
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                    {isSkipped && <Ban className="w-3 h-3" />}
                    {!isCompleted && !isSkipped && <Clock className="w-3 h-3" />}
                    <span>{parcel.status}</span>
                  </span>
                </div>

                {/* Customer Details */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">{parcel.customerName}</h4>
                    {hasPhone ? (
                      <button
                        onClick={() => handleCall(parcel.phone || parcel.normalizedPhone)}
                        className="font-mono text-cyan-400 text-xs font-semibold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {parcel.phone || parcel.normalizedPhone}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">No Phone</span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-300 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-cyan-300 font-semibold">{parcel.township}</strong> — {parcel.address}
                    </span>
                  </div>

                  {parcel.note && (
                    <p className="text-[10px] text-slate-400 bg-black/30 px-2 py-1 rounded border border-slate-800/60 line-clamp-1">
                      💬 {parcel.note}
                    </p>
                  )}
                </div>

                {/* Quick Interactive Actions */}
                <div className="pt-1 flex items-center justify-between gap-1.5 border-t border-slate-800/80">
                  {/* Map Button */}
                  <button
                    onClick={() => handleOpenMap(parcel)}
                    className="h-8 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 border border-slate-700"
                    title="Open Map"
                  >
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span>Map</span>
                  </button>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateStatus(parcel.id, 'Pending')}
                      className={`h-8 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                        parcel.status === 'Pending'
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Pending
                    </button>

                    <button
                      onClick={() => onUpdateStatus(parcel.id, 'Completed')}
                      className={`h-8 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                        parcel.status === 'Completed'
                          ? 'bg-emerald-500 text-black shadow-sm'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Done</span>
                    </button>

                    <button
                      onClick={() => onUpdateStatus(parcel.id, 'Skipped')}
                      className={`h-8 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                        parcel.status === 'Skipped'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Footer Total COD & Settlement Tracker */}
      <div className="p-3 bg-[#12151D] border-t border-slate-800/90 flex items-center justify-between text-xs shrink-0">
        <div>
          <span className="text-[10px] text-slate-400 block">ကောက်ခံပြီး COD / စုစုပေါင်း</span>
          <div className="font-mono text-xs font-bold text-white mt-0.5">
            <span className="text-emerald-400">{stats.collectedCod.toLocaleString()}</span> / {stats.totalCod.toLocaleString()} Ks
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono">
            {stats.completed}/{stats.total} Delivered
          </span>
        </div>
      </div>

    </div>
  );
};

