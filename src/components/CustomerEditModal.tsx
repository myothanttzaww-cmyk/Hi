import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  FileText,
  Save,
  Compass,
  AlertCircle,
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { Customer } from '../types';
import { CustomerStorage } from '../data/customerStore';
import { cleanPhoneNumber, isValidMyanmarPhone } from '../utils/ocrEngine';

interface CustomerEditModalProps {
  isOpen: boolean;
  customerToEdit?: Customer | null;
  initialPhone?: string;
  initialName?: string;
  initialAddress?: string;
  onClose: () => void;
  onSaveSuccess: (savedCustomer: Customer) => void;
  onOpenExistingDuplicate?: (existingCustomer: Customer) => void;
}

const TOWNSHIP_OPTIONS = [
  'ကျောက်တံတား (Kyauktada)',
  'ပန်းဘဲတန်း (Pabedan)',
  'လသာ (Latha)',
  'လမ်းမတော် (Lanmadaw)',
  'ဗိုလ်တထောင် (Botahtaung)',
  'မင်္ဂလာတောင်ညွန့် (Mingalar Taung Nyunt)',
  'ဒဂုံ (Dagon)',
  'ဗဟန်း (Bahan)',
  'စမ်းချောင်း (Sanchaung)',
  'ကမာရွတ် (Kamayut)',
  'လှိုင် (Hlaing)',
  'မရမ်းကုန်း (Mayangone)',
  'အင်းစိန် (Insein)',
  'တောင်ဥက္ကလာပ (South Okkalapa)',
  'မြောက်ဥက္ကလာပ (North Okkalapa)',
  'တာမွေ (Tamwe)',
  'သာကေတ (Thaketa)',
  'ဒေါပုံ (Dawbon)',
  'လှိုင်သာယာ (Hlaingtharya)',
  'ရွှေပြည်သာ (Shwepyitha)',
  'ချမ်းအေးသာစံ (Mandalay)',
  'မဟာအောင်မြေ (Mandalay)',
  'ဥဿာမြို့သစ် (Bago)',
  'အခြားမြို့နယ် (Other)'
];

const LOCATION_PRESETS = [
  { label: 'Downtown YGN', lat: 16.7745, lng: 96.1601 },
  { label: 'Kamayut Hledan', lat: 16.8290, lng: 96.1280 },
  { label: 'Mayangone Thamaing', lat: 16.8580, lng: 96.1360 },
  { label: 'South Okkalapa', lat: 16.8520, lng: 96.1780 },
  { label: 'Mandalay Center', lat: 21.9750, lng: 96.0833 },
  { label: 'Bago Center', lat: 17.3221, lng: 96.4813 }
];

export const CustomerEditModal: React.FC<CustomerEditModalProps> = ({
  isOpen,
  customerToEdit,
  initialPhone = '',
  initialName = '',
  initialAddress = '',
  onClose,
  onSaveSuccess,
  onOpenExistingDuplicate
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [township, setTownship] = useState(TOWNSHIP_OPTIONS[0]);
  const [latitude, setLatitude] = useState<number | null>(16.7745);
  const [longitude, setLongitude] = useState<number | null>(96.1601);
  const [note, setNote] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateCustomer, setDuplicateCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name || '');
      setPhone(customerToEdit.phone || customerToEdit.normalizedPhone || '');
      setAddress(customerToEdit.address || '');
      setTownship(customerToEdit.township || TOWNSHIP_OPTIONS[0]);
      setLatitude(customerToEdit.latitude);
      setLongitude(customerToEdit.longitude);
      setNote(customerToEdit.note || '');
    } else {
      setName(initialName || '');
      setPhone(initialPhone || '');
      setAddress(initialAddress || '');
      setTownship(TOWNSHIP_OPTIONS[0]);
      setLatitude(16.7745);
      setLongitude(96.1601);
      setNote('');
    }
    setErrorMessage(null);
    setDuplicateCustomer(null);
  }, [customerToEdit, initialPhone, initialName, initialAddress, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setErrorMessage(null);
    setDuplicateCustomer(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('ကျေးဇူးပြု၍ Customer Name ထည့်သွင်းပေးပါ');
      return;
    }

    const trimmedPhone = phone.trim();
    let cleanedPhone = '';
    if (trimmedPhone) {
      cleanedPhone = cleanPhoneNumber(trimmedPhone);
      // Check duplicate phone
      const existing = CustomerStorage.findCustomerByPhone(cleanedPhone);
      if (existing && (!customerToEdit || existing.id !== customerToEdit.id)) {
        setErrorMessage('ဒီ Customer ရှိပြီးသားဖြစ်ပါသည်');
        setDuplicateCustomer(existing);
        return;
      }
    }

    if (customerToEdit) {
      // Update existing
      const res = CustomerStorage.updateCustomer(customerToEdit.id, {
        name: trimmedName,
        phone: trimmedPhone,
        address: address.trim() || 'No address provided',
        township,
        latitude,
        longitude,
        note: note.trim()
      });

      if (res.success && res.customer) {
        onSaveSuccess(res.customer);
      } else {
        setErrorMessage(res.error || 'Update ပြုလုပ်ရာတွင် အမှားတစ်ခုဖြစ်ပွားခဲ့သည်');
      }
    } else {
      // Create new customer
      const res = CustomerStorage.addCustomer({
        name: trimmedName,
        phone: trimmedPhone,
        normalizedPhone: cleanedPhone,
        address: address.trim() || 'No address provided',
        township,
        latitude,
        longitude,
        note: note.trim()
      });

      if (res.success) {
        onSaveSuccess(res.customer);
      } else if (res.isDuplicate && res.customer) {
        setErrorMessage('ဒီ Customer ရှိပြီးသားဖြစ်ပါသည်');
        setDuplicateCustomer(res.customer);
      } else {
        setErrorMessage('Customer အသစ်ထည့်ရာတွင် အမှားတစ်ခုဖြစ်ပွားခဲ့သည်');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#141720] border border-slate-700/80 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col justify-between overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#181C26] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {customerToEdit ? 'ဖောက်သည် အချက်အလက် ပြင်ဆင်ရန်' : 'ဖောက်သည် အသစ် ထည့်သွင်းရန်'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {customerToEdit ? `ID: ${customerToEdit.id}` : 'Room Database New Customer Record'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          {/* Error Banner / Duplicate Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex flex-col gap-2 animate-shake">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-bold">{errorMessage}</span>
              </div>
              {duplicateCustomer && (
                <div className="bg-black/40 p-2.5 rounded-lg border border-rose-500/30 flex items-center justify-between text-[11px]">
                  <div>
                    <p className="font-semibold text-white">{duplicateCustomer.name}</p>
                    <p className="text-slate-400 font-mono">{duplicateCustomer.phone}</p>
                  </div>
                  {onOpenExistingDuplicate && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenExistingDuplicate(duplicateCustomer);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all text-xs"
                    >
                      ဖွင့်မည် (Open)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 1. Customer Name (Required) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer Name (ဖောက်သည် အမည်) *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ဥပမာ - ဦးမင်းမင်းထွန်း (U Min Min Htun)"
              className="w-full h-11 px-3.5 rounded-xl bg-[#1B202D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
              required
            />
          </div>

          {/* 2. Phone Number (Optional as per Section 2) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Phone Number (ဖုန်းနံပါတ်)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded">
                Optional (မဖြစ်မနေ မလိုပါ)
              </span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ဥပမာ - 09450012345 (မြန်မာ/အင်္ဂလိပ်ဂဏန်း)"
              className="w-full h-11 px-3.5 rounded-xl bg-[#1B202D] border border-slate-700 font-mono text-cyan-400 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-semibold"
            />
            <p className="text-[10px] text-slate-500">
              * ဖုန်းနံပါတ် မရှိလျှင် Customer ID ဖြင့် အလိုအလျောက် သတ်မှတ်ပါမည်။
            </p>
          </div>

          {/* 3. Township Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>Township (မြို့နယ်)</span>
            </label>
            <select
              value={township}
              onChange={(e) => setTownship(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#1B202D] border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-medium"
            >
              {TOWNSHIP_OPTIONS.map((tsp, idx) => (
                <option key={idx} value={tsp} className="bg-[#181C26] text-white">
                  {tsp}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Address (အပြည့်အစုံ လိပ်စာ)</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="ဥပမာ - အမှတ် (၄၅)၊ ကုန်သည်လမ်း၊ ၃ လွှာ"
              className="w-full p-3 rounded-xl bg-[#1B202D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium resize-none"
            />
          </div>

          {/* 5. Location / GPS Coordinates (Phase 4 Foundation) */}
          <div className="space-y-2 p-3 rounded-xl bg-black/30 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>GPS Location (Phase 4 Route Foundation)</span>
              </label>
            </div>

            {/* Quick Location Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {LOCATION_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setLatitude(p.lat);
                    setLongitude(p.lng);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[10px] font-medium border border-slate-700 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Latitude</span>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude || ''}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || null)}
                  placeholder="16.7745"
                  className="w-full h-9 px-2.5 rounded-lg bg-[#181C26] border border-slate-700 font-mono text-emerald-400 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Longitude</span>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude || ''}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || null)}
                  placeholder="96.1601"
                  className="w-full h-9 px-2.5 rounded-lg bg-[#181C26] border border-slate-700 font-mono text-emerald-400 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* 6. Special Note */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Delivery Note (ပို့ဆောင်ရေး မှတ်ချက်)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ဥပမာ - ရုံးခန်း ၃ လွှာသို့ ပို့ပေးပါ။ ဖုန်းကြိုဆက်ပါ။"
              className="w-full h-10 px-3.5 rounded-xl bg-[#1B202D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-[#181C26] border-t border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            မလုပ်ပါ (Cancel)
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>သိမ်းဆည်းမည် (Save)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
