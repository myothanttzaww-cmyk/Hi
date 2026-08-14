import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ArrowLeft,
  Phone,
  MapPin,
  FileText,
  User,
  CheckCircle2,
  PhoneOff,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerListViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onAddNewCustomer: () => void;
  onNavigateBack: () => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  onSelectCustomer,
  onAddNewCustomer,
  onNavigateBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'has_phone' | 'no_phone' | 'top_delivery'>('all');

  // Instant Local Search across Phone (normalized), Name, Address, Township, Note
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryDigits = searchQuery.replace(/[^0-9]/g, '');

    return customers.filter(customer => {
      // Filter Type condition
      if (filterType === 'has_phone' && !customer.normalizedPhone) return false;
      if (filterType === 'no_phone' && customer.normalizedPhone) return false;
      if (filterType === 'top_delivery' && customer.deliveryCount < 5) return false;

      if (!query) return true;

      // Match normalized phone or raw phone
      if (queryDigits && customer.normalizedPhone && customer.normalizedPhone.includes(queryDigits)) {
        return true;
      }
      if (customer.phone && customer.phone.toLowerCase().includes(query)) {
        return true;
      }
      // Match name
      if (customer.name && customer.name.toLowerCase().includes(query)) {
        return true;
      }
      // Match address
      if (customer.address && customer.address.toLowerCase().includes(query)) {
        return true;
      }
      // Match township
      if (customer.township && customer.township.toLowerCase().includes(query)) {
        return true;
      }
      // Match note
      if (customer.note && customer.note.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [customers, searchQuery, filterType]);

  return (
    <div className="w-full h-full bg-[#0D0F14] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Top App Bar */}
      <div className="bg-[#12151D] px-4 py-3.5 border-b border-slate-800/90 flex items-center justify-between z-10 shrink-0">
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
              <span>ဖောက်သည် စာရင်း (Customers)</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                {filteredCustomers.length}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Room Local Database (Indexed Search)</p>
          </div>
        </div>

        <button
          onClick={onAddNewCustomer}
          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>အသစ်ထည့်</span>
        </button>
      </div>

      {/* Search & Filter Header */}
      <div className="p-3.5 bg-[#12151D]/60 border-b border-slate-800/60 space-y-2.5 shrink-0">
        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ဖုန်းနံပါတ်၊ အမည်၊ မြို့နယ် သို့မဟုတ် လိပ်စာဖြင့် ရှာရန်..."
            className="w-full h-10 pl-9 pr-8 rounded-xl bg-[#181C26] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-medium pt-0.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-slate-800/90 text-slate-400 hover:bg-slate-700'
            }`}
          >
            အားလုံး ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('has_phone')}
            className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
              filterType === 'has_phone'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-slate-800/90 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ဖုန်းရှိသူများ
          </button>
          <button
            onClick={() => setFilterType('no_phone')}
            className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
              filterType === 'no_phone'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-slate-800/90 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Phone မရှိသူများ
          </button>
          <button
            onClick={() => setFilterType('top_delivery')}
            className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
              filterType === 'top_delivery'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-slate-800/90 text-slate-400 hover:bg-slate-700'
            }`}
          >
            မကြာခဏပို့ (Top)
          </button>
        </div>
      </div>

      {/* Customer List Items */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {filteredCustomers.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/70 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-300">ဖောက်သည် ရှာမတွေ့ပါ</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              "{searchQuery}" နှင့် ကိုက်ညီသော Customer မရှိသေးပါ။ ဖောက်သည်အသစ် ထည့်သွင်းနိုင်ပါသည်။
            </p>
            <button
              onClick={onAddNewCustomer}
              className="mt-3.5 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-bold text-xs hover:bg-cyan-500/25 transition-all"
            >
              + ဖောက်သည်အသစ် ထည့်ရန်
            </button>
          </div>
        ) : (
          filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCustomer(c)}
              className="p-3 rounded-2xl bg-[#151922] hover:bg-[#1A202C] border border-slate-800/90 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1 min-w-0">
                  {/* Name & Delivery Badge */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white truncate group-hover:text-cyan-300 transition-colors">
                      {c.name}
                    </span>
                    {c.deliveryCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold shrink-0">
                        {c.deliveryCount}x ပို့ပြီး
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {c.normalizedPhone ? (
                      <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        {c.phone || c.normalizedPhone}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 italic text-[10px]">
                        <PhoneOff className="w-3 h-3 text-slate-500" />
                        ဖုန်းနံပါတ် မရှိပါ (ID: {c.id})
                      </span>
                    )}
                  </div>

                  {/* Township & Address */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium">{c.township}</span>
                    <span className="text-slate-600">•</span>
                    <span className="truncate">{c.address}</span>
                  </div>

                  {/* Note */}
                  {c.note && (
                    <div className="text-[10px] text-slate-400 bg-black/30 px-2 py-1 rounded-lg line-clamp-1 border border-slate-800/60 mt-1">
                      💬 {c.note}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <div className="w-7 h-7 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  {c.latitude && c.longitude && (
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" /> GPS
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 bg-[#12151D] border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Unique Phone Constraint Active</span>
        </span>
        <span className="font-mono text-cyan-400 font-semibold">
          {customers.length} Customers
        </span>
      </div>

    </div>
  );
};
