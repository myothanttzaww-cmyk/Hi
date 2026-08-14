import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  ExternalLink,
  Code2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'ဖုန်း Chrome Browser ၏ ညာဘက်ထိပ်ရှိ ⋮ (အစက်သုံးစက်) ကို နှိပ်ပြီး "Install app" (သို့မဟုတ် "Add to Home screen") ကို ရွေးချယ်ပေးပါခင်ဗျာ။'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-sm bg-[#12151D] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-[#182030] to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>RexGo App သွင်းယူရန်</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black text-[9px] font-extrabold">Build</span>
              </h3>
              <p className="text-[10px] text-slate-400">Mobile Installation & APK Guide</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ဖုန်းတွင် App သွင်းမည် (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Android APK Build</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          
          {activeTab === 'pwa' && (
            <>
              {/* Direct Install Action Box */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-black flex items-center justify-center shadow-lg">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">RexGo Delivery v1.0.0</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    ဖုန်း Home Screen ပေါ်တွင် Native App ကဲ့သို့ ချက်ချင်းသွင်းယူနိုင်ပါသည်
                  </p>
                </div>

                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-98 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalled ? 'App ထည့်သွင်းပြီးပါပြီ ✓' : 'App အဖြစ် ဖုန်းထဲထည့်သွင်းမည်'}</span>
                </button>
              </div>

              {/* Instructions List */}
              <div className="space-y-2 text-[11px]">
                <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                  ဖုန်းအမျိုးအစားအလိုက် အသုံးပြုနည်း -
                </span>

                {/* Android Chrome */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <span>🤖 Android ဖုန်း (Chrome Browser):</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-300 space-y-0.5 pl-1 leading-relaxed">
                    <li>အပေါ်ရှိ <b>"App အဖြစ် ဖုန်းထဲထည့်သွင်းမည်"</b> ခလုတ်ကို နှိပ်ပါ။</li>
                    <li>သို့မဟုတ် Chrome ၏ ညာဘက်ထိပ်ရှိ <b>⋮ (အစက်သုံးစက်)</b> ကို နှိပ်ပါ။</li>
                    <li><b>"Install app"</b> (သို့မဟုတ် <b>"Add to Home screen"</b>) ကို ရွေးချယ်ပါ။</li>
                  </ol>
                </div>

                {/* iPhone Safari */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>🍎 iPhone / iPad (Safari Browser):</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-300 space-y-0.5 pl-1 leading-relaxed">
                    <li>Safari အောက်ခြေရှိ <b>Share Icon (မျှဝေရန် အမှတ်အသား)</b> ကို နှိပ်ပါ။</li>
                    <li>အောက်သို့ဆွဲချပြီး <b>"Add to Home Screen"</b> ကို ရွေးပါ။</li>
                    <li>ညာဘက်ထိပ်ရှိ <b>"Add"</b> ကို နှိပ်ပါ။</li>
                  </ol>
                </div>
              </div>
            </>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1.5">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Native Android Source Code အသင့်ရှိသည်</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  RexGo တွင် Native Android (Kotlin + Jetpack Compose + ML Kit OCR + Room Database) ဖွဲ့စည်းပုံ အပြည့်အစုံ ပါဝင်ပြီးဖြစ်ပါသည်။
                </p>
              </div>

              {/* Steps for Android Studio Build */}
              <div className="space-y-2 text-[11px]">
                <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider block">
                  Android Studio ဖြင့် APK ထုတ်နည်း (Gradle Build) -
                </span>

                <div className="p-2.5 rounded-xl bg-black/80 font-mono text-[10px] text-cyan-300 border border-slate-800 space-y-1">
                  <p className="text-slate-500">// 1. Export project via Settings &rarr; Export ZIP</p>
                  <p className="text-slate-500">// 2. Run Gradle assemble release command:</p>
                  <p className="text-white bg-slate-900 p-1.5 rounded">./gradlew assembleDebug</p>
                  <p className="text-slate-400 mt-1">Output APK: <span className="text-emerald-400">app/build/outputs/apk/debug/app-debug.apk</span></p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-[10px]">
                  💡 ညာဘက်ထိပ်ရှိ <b>Settings Menu &rarr; Export as ZIP</b> မှတစ်ဆင့် Project တစ်ခုလုံးကို ဒေါင်းလုဒ်ဆွဲယူနိုင်ပါသည်။
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">RexGo v1.0.0 • Mobile Production</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            ပိတ်မည်
          </button>
        </div>

      </div>
    </div>
  );
};
