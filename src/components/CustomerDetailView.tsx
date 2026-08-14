import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  Package,
  Calendar,
  Compass,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerDetailViewProps {
  customer: Customer;
  onNavigateBack: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onAddToTodayDelivery: (customer: Customer) => void;
}

export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({
  customer,
  onNavigateBack,
  onEditCustomer,
  onDeleteCustomer,
  onAddToTodayDelivery
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyPhone = () => {
    if (customer.phone || customer.normalizedPhone) {
      navigator.clipboard.writeText(customer.phone || customer.normalizedPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCall = () => {
    if (!customer.normalizedPhone && !customer.phone) return;
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
    }, 2500);
  };

  const handleOpenMap = () => {
    if (customer.latitude && customer.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${customer.latitude},${customer.longitude}`;
      window.open(url, '_blank');
    } else {
      setToastMessage('Location GPS မထည့်ရသေးပါ။ Edit မှတစ်ဆင့် တည်နေရာသတ်မှတ်ပါ။');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const hasPhone = Boolean(customer.phone || customer.normalizedPhone);

  return (
    <div className="w-full h-full bg-[#0D0F14] text-slate-100 flex flex-col justify-between overflow-y-auto select-none p-4 space-y-4">
      
      {/* Top App Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white">ဖောက်သည် အချက်အလက်</h2>
            <p className="text-[11px] text-slate-400">Customer Profile & Delivery Record</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEditCustomer(customer)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all text-xs flex items-center gap-1 font-semibold"
            title="Edit Customer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ပြင်ဆင်မည်</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all text-xs"
            title="Delete Customer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161B26] to-[#11141D] border border-cyan-500/30 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md font-semibold">
              ID: {customer.id}
            </span>
            <h3 className="text-base font-bold text-white mt-1">{customer.name}</h3>
            <p className="text-xs text-cyan-400 font-medium">{customer.township}</p>
          </div>

          <div className="flex flex-col items-end">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Package className="w-3 h-3" />
              {customer.deliveryCount} ကြိမ် ပို့ဆောင်ပြီး
            </span>
          </div>
        </div>

        {/* Phone Box */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasPhone ? (
              <>
                <Phone className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-base font-bold text-cyan-300 tracking-wide">
                  {customer.phone || customer.normalizedPhone}
                </span>
              </>
            ) : (
              <>
                <PhoneOff className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-400 italic font-medium">
                  ဖုန်းနံပါတ် မရှိပါ (No Phone Attached)
                </span>
              </>
            )}
          </div>

          {hasPhone && (
            <button
              onClick={handleCopyPhone}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
              title="Copy Phone"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Primary Action Buttons: Call (Only if Phone exists) & Open Map */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {hasPhone ? (
            <button
              onClick={handleCall}
              className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Phone className="w-4 h-4 text-black" />
              <span>ဖုန်းခေါ်မည် (Direct Call)</span>
            </button>
          ) : (
            <button
              onClick={() => onEditCustomer(customer)}
              className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>ဖုန်းနံပါတ် ထည့်မည်</span>
            </button>
          )}

          <button
            onClick={handleOpenMap}
            className="h-11 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Open Map (မြေပုံ)</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Simulated Direct Call Toast */}
      {isCalling && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Native Android Intent: <strong>tel:{customer.phone || customer.normalizedPhone}</strong> သို့ ချိတ်ဆက်နေပါသည်...</span>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-amber-950/90 border border-amber-500 text-amber-300 text-xs flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Address & GPS Location Card */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-slate-800 space-y-3 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            လိပ်စာနှင့် တည်နေရာ (Address & Location)
          </span>
        </div>

        <div className="space-y-1.5">
          <p className="text-slate-200 text-xs leading-relaxed font-medium">
            {customer.address}
          </p>
          <p className="text-cyan-400 text-xs font-semibold">
            မြို့နယ်: {customer.township}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">GPS Coordinates:</span>
          {customer.latitude && customer.longitude ? (
            <span className="font-mono text-emerald-400 font-semibold">
              Lat: {customer.latitude.toFixed(4)}, Lng: {customer.longitude.toFixed(4)}
            </span>
          ) : (
            <span className="text-slate-500 italic">သတ်မှတ်ထားခြင်း မရှိသေးပါ</span>
          )}
        </div>
      </div>

      {/* Delivery Notes & Special Instructions */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-slate-800 space-y-2 text-xs">
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          မှတ်ချက် / အထူးမှာကြားချက် (Delivery Note)
        </div>
        <p className="text-slate-300 bg-black/30 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
          {customer.note || 'မှတ်ချက် မရှိပါ။'}
        </p>
      </div>

      {/* Delivery History & Timestamps */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-slate-800 space-y-2 text-xs">
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          ပို့ဆောင်မှု မှတ်တမ်း (Delivery Log)
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2.5 rounded-xl bg-black/30 border border-slate-800/60">
            <span className="text-slate-500 block text-[10px]">နောက်ဆုံးပို့ဆောင်သည့်ရက်</span>
            <span className="text-slate-200 font-semibold mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" />
              {customer.lastDeliveredAt ? new Date(customer.lastDeliveredAt).toLocaleDateString() : 'မရှိသေးပါ'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-slate-800/60">
            <span className="text-slate-500 block text-[10px]">စတင်မှတ်ပုံတင်သည့်ရက်</span>
            <span className="text-slate-200 font-semibold mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              {new Date(customer.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action: Add Parcel to Today's Delivery */}
      <div className="pt-1">
        <button
          onClick={() => onAddToTodayDelivery(customer)}
          className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <Package className="w-4 h-4 text-black" />
          <span>ယနေ့ပို့ဆောင်မည့်စာရင်းသို့ ထည့်မည် (Add to Today's Delivery)</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-[#161922] border border-rose-500/50 p-4 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">ဖောက်သည်အား ဖျက်ရန် သေချာပါသလား?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>{customer.name}</strong> ၏ အချက်အလက်များကို Database မှ ဖျက်ပစ်ပါမည်။ ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍မရပါ။
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium"
              >
                မဖျက်ပါ
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteCustomer(customer.id);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                ဖျက်မည် (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
