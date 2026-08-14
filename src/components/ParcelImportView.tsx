import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Code,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  Package,
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ImportSummary } from '../types';
import { CustomerStorage } from '../data/customerStore';
import { DEMO_40_CSV, DEMO_40_JSON } from '../data/demoBatches';

interface ParcelImportViewProps {
  onNavigateBack: () => void;
  onImportComplete: (summary: ImportSummary) => void;
}

export const ParcelImportView: React.FC<ParcelImportViewProps> = ({
  onNavigateBack,
  onImportComplete
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'csv' | 'json'>('demo');
  const [csvContent, setCsvContent] = useState(DEMO_40_CSV);
  const [jsonContent, setJsonContent] = useState(DEMO_40_JSON);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImportDemo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const summary = CustomerStorage.importParcelsFromCsv(DEMO_40_CSV);
      setIsProcessing(false);
      setImportSummary(summary);
      onImportComplete(summary);
    }, 400);
  };

  const handleImportCsv = () => {
    if (!csvContent.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const summary = CustomerStorage.importParcelsFromCsv(csvContent);
      setIsProcessing(false);
      setImportSummary(summary);
      onImportComplete(summary);
    }, 400);
  };

  const handleImportJson = () => {
    if (!jsonContent.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const summary = CustomerStorage.importParcelsFromJson(jsonContent);
      setIsProcessing(false);
      setImportSummary(summary);
      onImportComplete(summary);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'json') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (type === 'csv') {
        setCsvContent(content);
      } else {
        setJsonContent(content);
      }
    };
    reader.readAsText(file);
  };

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
            <h2 className="text-sm font-bold text-white">ပါဆယ် အစုလိုက်သွင်းရန် (Parcel Import)</h2>
            <p className="text-[11px] text-slate-400">Batch Inbound CSV / JSON Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>40+ Parcels Fast Engine</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#151922] rounded-xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('demo')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'demo'
              ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>40-Parcel Demo</span>
        </button>

        <button
          onClick={() => setActiveTab('csv')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'csv'
              ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>CSV Format</span>
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'json'
              ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>JSON Format</span>
        </button>
      </div>

      {/* Tab 1: 40-Parcel Demo Benchmark */}
      {activeTab === 'demo' && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161B26] to-[#0F121A] border border-cyan-500/30 space-y-3.5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                Benchmark Testing Ready
              </span>
              <h3 className="text-sm font-bold text-white mt-1.5">
                40+ Parcels Batch Demo Dataset
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                စမ်းသပ်ရန်အတွက် ရန်ကုန်၊ မန္တလေးနှင့် ပဲခူးမြို့နယ်များမှ ပါဆယ် ၄၀ ကျော် ပါဝင်သော နမူနာ Data ဖြစ်ပါသည်။ တစ်ချက်နှိပ်ရုံဖြင့် အလိုအလျောက် သွင်းယူနိုင်ပါသည်။
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ဖုန်းနံပါတ် Auto Normalization</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Customer Match / Unknown Auto-create</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Duplicate & Error Row Skipping</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>120Hz Fast UI Dispatch</span>
            </div>
          </div>

          <button
            onClick={handleImportDemo}
            disabled={isProcessing}
            className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>ပါဆယ် ၄၀ အား သွင်းနေပါသည်...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>ပါဆယ် ၄၀ အား တစ်ခါတည်း သွင်းမည် (Import 40 Parcels)</span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Tab 2: CSV Format Import */}
      {activeTab === 'csv' && (
        <div className="p-4 rounded-2xl bg-[#141822] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">CSV Data ထည့်သွင်းရန်</span>
            <label className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold cursor-pointer border border-slate-700">
              <span>Choose .CSV File</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'csv')}
              />
            </label>
          </div>

          <p className="text-[11px] text-slate-400">
            Format: <code className="text-cyan-300 font-mono">Phone,Name,Address,Township,COD,Note</code> (အနည်းဆုံး Phone Number ပါဝင်ရမည်)
          </p>

          <textarea
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-xl bg-black/60 border border-slate-700 font-mono text-[11px] text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none"
            placeholder="Phone,Name,Address,Township,COD,Note..."
          />

          <button
            onClick={handleImportCsv}
            disabled={isProcessing}
            className="w-full h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>CSV Data သွင်းမည် (Import CSV)</span>
          </button>
        </div>
      )}

      {/* Tab 3: JSON Format Import */}
      {activeTab === 'json' && (
        <div className="p-4 rounded-2xl bg-[#141822] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">JSON Array ထည့်သွင်းရန်</span>
            <label className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold cursor-pointer border border-slate-700">
              <span>Choose .JSON File</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'json')}
              />
            </label>
          </div>

          <p className="text-[11px] text-slate-400">
            JSON Array of objects containing <code className="text-cyan-300 font-mono">phone, name, address, township, cod, note</code>.
          </p>

          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-xl bg-black/60 border border-slate-700 font-mono text-[11px] text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none"
            placeholder="[ { phone: '09...', name: '...' } ]"
          />

          <button
            onClick={handleImportJson}
            disabled={isProcessing}
            className="w-full h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>JSON Data သွင်းမည် (Import JSON)</span>
          </button>
        </div>
      )}

      {/* Import Summary Results Card */}
      {importSummary && (
        <div className="p-4 rounded-2xl bg-[#121A16] border border-emerald-500/40 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Import အောင်မြင်စွာ ပြီးဆုံးပါသည် (Summary)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date(importSummary.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">စုစုပေါင်း</span>
              <span className="font-bold text-white font-mono text-sm">{importSummary.totalRows}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 block">သွင်းပြီး</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{importSummary.importedCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 block">ကျော်ခွ / Error</span>
              <span className="font-bold text-rose-400 font-mono text-sm">{importSummary.skippedCount}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1 bg-black/40 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span>• Customer Database နှင့် တိုက်ဆိုင်တွေ့ရှိမှု:</span>
              <strong className="text-emerald-400 font-mono">{importSummary.matchedCustomerCount} ခု</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>• Unknown Customer အသစ်ဖန်တီးမှု:</span>
              <strong className="text-amber-400 font-mono">{importSummary.unknownCustomerCount} ခု</strong>
            </div>
          </div>

          {/* Error / Skipped Rows Breakdown */}
          {importSummary.errors.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>ဖုန်းနံပါတ်မပါ၍ ကျော်ခွခဲ့သော အကြောင်းအရာများ (Skipped Rows)</span>
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {importSummary.errors.map((err, idx) => (
                  <div key={idx} className="text-[10px] p-1.5 rounded bg-rose-950/40 border border-rose-500/20 text-rose-300 font-mono">
                    Row {err.row}: {err.reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onNavigateBack}
            className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-2"
          >
            <span>ယနေ့ပို့ဆောင်မည့် စာရင်းသို့ သွားမည်</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-3 rounded-xl bg-black/30 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Data Safety Guaranteed:</strong> အစုလိုက် သွင်းယူရာတွင် ရှိပြီးသား Customer Data များကို ဖျက်ပစ်ခြင်း မပြုဘဲ ဘေးကင်းစွာ ပေါင်းစပ်သိမ်းဆည်းပေးပါသည်။
        </span>
      </div>

    </div>
  );
};
