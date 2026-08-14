import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Edit3,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  Bot,
  Zap,
  PenTool
} from 'lucide-react';
import { OcrResult, PhoneNumberCandidate } from '../types';
import { verifyPhoneWithGeminiVision } from '../utils/ocrEngine';

interface OcrResultViewProps {
  ocrResult: OcrResult;
  onRescan: () => void;
  onContinue: (phone: string) => void;
}

export const OcrResultView: React.FC<OcrResultViewProps> = ({
  ocrResult,
  onRescan,
  onContinue
}) => {
  const [currentPhone, setCurrentPhone] = useState(ocrResult.normalizedPhoneNumber);
  const [selectedCandidate, setSelectedCandidate] = useState<PhoneNumberCandidate | undefined>(
    ocrResult.candidates[0]
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(ocrResult.normalizedPhoneNumber);
  const [copied, setCopied] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  // Gemini Vision Verification State
  const [isVerifyingGemini, setIsVerifyingGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState<{
    phone: string;
    confidence: number;
    reasoning: string;
    isHandwritten: boolean;
    source: string;
  } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editInput.trim()) {
      setCurrentPhone(editInput.trim());
    }
    setIsEditing(false);
  };

  const handleCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
    }, 2500);
  };

  const handleVerifyWithGemini = async () => {
    setIsVerifyingGemini(true);
    try {
      const res = await verifyPhoneWithGeminiVision({
        rawText: ocrResult.fullRawText,
        detectedNumber: currentPhone,
        note: `Recipient: ${ocrResult.receiverName || ''}, Address: ${ocrResult.deliveryAddress || ''}`
      });
      setGeminiResult(res);
      if (res.phone) {
        setCurrentPhone(res.phone);
      }
    } catch (err) {
      console.warn('Gemini verification error:', err);
    } finally {
      setIsVerifyingGemini(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#0D0F14] text-slate-100 flex flex-col justify-between overflow-y-auto select-none p-4 space-y-4">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRescan}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>စကင်ဖတ် ရလဒ် (OCR Result)</span>
              {ocrResult.isHandwrittenDetected && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                  ✍️ လက်ရေးစနစ်
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">
              Google ML Kit Native OCR + Preprocessing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{(ocrResult.confidence * 100).toFixed(0)}% Match</span>
        </div>
      </div>

      {/* 2. Main Phone Card (Primary Output) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#141824] to-[#0F121A] border-2 border-cyan-500/40 shadow-xl space-y-3 relative overflow-hidden">
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            လက်ခံသူ ဖုန်းနံပါတ် (Main Recipient)
          </span>
          {selectedCandidate?.matchedLabel && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              Tag: {selectedCandidate.matchedLabel}
            </span>
          )}
        </div>

        {/* Big Phone Number Display */}
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800">
          <div className="font-mono text-2xl font-extrabold text-cyan-400 tracking-wider">
            {currentPhone}
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
            title="Copy Phone Number"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Edit & Direct Call Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => {
              setEditInput(currentPhone);
              setIsEditing(true);
            }}
            className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>ပြင်ဆင်မည် (Edit)</span>
          </button>

          <button
            onClick={handleCall}
            className="h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Phone className="w-3.5 h-3.5 text-black" />
            <span>ဖုန်းခေါ်မည် (Call)</span>
          </button>
        </div>
      </div>

      {/* 3. Gemini Vision AI Verification Card (Dual Engine Comparison) */}
      <div className="p-3.5 rounded-2xl bg-[#121622] border border-cyan-500/30 space-y-2.5 text-xs shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 text-black flex items-center justify-center font-bold">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white text-[12px] block">Gemini 2.5 Flash Vision AI</span>
              <span className="text-[10px] text-slate-400">Cloud AI Verification & Handwriting Cross-Check</span>
            </div>
          </div>

          <button
            onClick={handleVerifyWithGemini}
            disabled={isVerifyingGemini}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            {isVerifyingGemini ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>စစ်ဆေးနေသည်...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI စစ်ဆေးမည်</span>
              </>
            )}
          </button>
        </div>

        {/* Gemini Result Banner */}
        {geminiResult && (
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-[11px] space-y-1 animate-fade-in">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Confidence: {(geminiResult.confidence * 100).toFixed(0)}%</span>
              </span>
              <span className="font-mono text-cyan-200">{geminiResult.phone}</span>
            </div>
            <p className="text-slate-300 text-[10px] leading-relaxed">
              {geminiResult.reasoning}
            </p>
          </div>
        )}
      </div>

      {/* Simulated Direct Call Toast */}
      {isCalling && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Native Android Dialer: <strong>tel:{currentPhone}</strong> သို့ ချိတ်ဆက်နေပါသည်...</span>
          </div>
        </div>
      )}

      {/* 4. Multiple Candidates List */}
      {ocrResult.candidates.length > 1 && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            တွေ့ရှိသော အခြားဖုန်းနံပါတ်များ (Other Candidates)
          </div>
          <div className="space-y-1.5">
            {ocrResult.candidates.map((cand, idx) => {
              const isSelected = cand.normalizedNumber === currentPhone;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentPhone(cand.normalizedNumber);
                    setSelectedCandidate(cand);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300 text-xs">
                      {cand.normalizedNumber}
                    </span>
                    {cand.matchedLabel && (
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        Label: {cand.matchedLabel}
                      </span>
                    )}
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Parcel & Detected Text Context */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            ပါဆယ် အချက်အလက် (Waybill Metadata)
          </span>
          {ocrResult.parcelTrackingNumber && (
            <span className="text-slate-300 font-mono font-semibold">
              {ocrResult.parcelTrackingNumber}
            </span>
          )}
        </div>

        {ocrResult.receiverName && (
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <User className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
            <span>လက်ခံသူ: <strong className="text-white">{ocrResult.receiverName}</strong></span>
          </div>
        )}

        {ocrResult.deliveryAddress && (
          <div className="flex items-start gap-2 text-slate-400 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{ocrResult.deliveryAddress}</span>
          </div>
        )}

        {/* Collapsible raw text */}
        <div className="pt-1.5 border-t border-slate-800/80">
          <details className="text-[10px] text-slate-400 cursor-pointer">
            <summary className="hover:text-slate-200">Raw OCR Extracted Text (ကြည့်ရန်)</summary>
            <pre className="mt-1 p-2 rounded bg-black/60 text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap text-[9px] max-h-24">
              {ocrResult.fullRawText}
            </pre>
          </details>
        </div>
      </div>

      {/* 6. Bottom Navigation & Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onRescan}
          className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>ပြန်ဖတ်မည် (Rescan)</span>
        </button>

        <button
          onClick={() => onContinue(currentPhone)}
          className="h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          <span>ရှေ့ဆက်မည် (Continue)</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Edit Phone Dialog Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-[#14171F] border border-slate-700 p-4 space-y-3 shadow-2xl">
            <h4 className="text-sm font-bold text-white">
              ဖုန်းနံပါတ် ပြင်ဆင်ရန် (Edit Phone)
            </h4>
            <p className="text-xs text-slate-400">
              မှန်ကန်သော ဖုန်းနံပါတ်ကို ထည့်သွင်းပါ:
            </p>
            <input
              type="tel"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-black/60 border border-cyan-500/60 font-mono text-cyan-400 font-bold text-sm focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium"
              >
                မလုပ်ပါ
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold"
              >
                သိမ်းမည် (Save)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

