import React, { useState } from 'react';
import {
  ArrowLeft,
  Moon,
  Info,
  FolderTree,
  ShieldCheck,
  Camera,
  Cpu,
  LogOut,
  CheckCircle2,
  Lock,
  ChevronRight,
  Download,
  Smartphone
} from 'lucide-react';
import { StorageExplorerModal } from './StorageExplorerModal';
import { InstallAppModal } from './InstallAppModal';

interface SettingsViewProps {
  onNavigateBack: () => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onNavigateBack,
  onLogout
}) => {
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="w-full h-full bg-[#0F1115] text-slate-100 flex flex-col justify-between overflow-y-auto select-none">
      <div>
        {/* Top App Bar */}
        <div className="sticky top-0 bg-[#0F1115]/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center gap-3 z-20">
          <button
            onClick={onNavigateBack}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Settings</h2>
            <p className="text-[11px] text-slate-400">စနစ် ပြင်ဆင်ချက်များ</p>
          </div>
        </div>

        {/* Settings Body */}
        <div className="p-4 space-y-4">
          
          {/* Section 1: Appearance */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              အသွင်အပြင် (Appearance)
            </span>
            <div className="mt-2 bg-[#181B22] border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dark Mode</h4>
                  <p className="text-[11px] text-slate-400">အမြဲတမ်းဖွင့်ထားသည် (Always Enabled)</p>
                </div>
              </div>

              {/* Locked Active Switch per requirement */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                <Lock className="w-3 h-3" />
                <span>Locked ON</span>
              </div>
            </div>
          </div>

          {/* Section 2: Architecture & Storage Status */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              စနစ်ဖွဲ့စည်းပုံ အခြေအနေ (Architecture Status)
            </span>
            <div className="mt-2 bg-[#181B22] border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden">
              
              {/* Item: Local Storage Folder Structure */}
              <button
                onClick={() => setShowStorageModal(true)}
                className="w-full p-3.5 flex items-center justify-between hover:bg-[#1E232E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Downloads/RexGo/ Folders</h5>
                    <p className="text-[11px] text-slate-400">7 Subdirectories Architecture</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Item: Permission Architecture */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Permission Architecture</h5>
                    <p className="text-[11px] text-slate-400">Camera / Location / Media Scaffolding</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
                  P1 Ready
                </span>
              </div>

              {/* Item: CameraX Scaffold */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">CameraX Scaffold</h5>
                    <p className="text-[11px] text-slate-400">Hardware Inactive (No OCR in P1)</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400">
                  Standby
                </span>
              </div>

              {/* Item: App Installation & APK Build */}
              <button
                onClick={() => setShowInstallModal(true)}
                className="w-full p-3.5 flex items-center justify-between hover:bg-[#1E232E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">App သွင်းယူရန် / APK Build</h5>
                    <p className="text-[11px] text-slate-400">Install PWA on Phone or Build APK</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold">
                  <span>Install</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Item: Device Optimization */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Redmi Turbo 4 Pro Specs</h5>
                    <p className="text-[11px] text-slate-400">Snapdragon 8s Gen 4 • 120Hz</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400">
                  120 FPS
                </span>
              </div>

            </div>
          </div>

          {/* Section 3: About RexGo */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              App အကြောင်း (About RexGo)
            </span>
            <div className="mt-2 bg-[#181B22] border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-300">Version</span>
                </div>
                <span className="text-xs font-bold text-cyan-400 font-mono">1.0.0</span>
              </div>

              <div>
                <p className="text-[11px] text-slate-500">Developer & Architect</p>
                <p className="text-sm font-bold text-cyan-400 mt-0.5">Powered by Myo Thant Zaw</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  RexGo Native Android Delivery Application (Kotlin • Jetpack Compose • Hilt • Room • DataStore)
                </p>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full h-11 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>အကောင့်မှ ထွက်ရန် (Logout)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Storage Explorer Modal */}
      <StorageExplorerModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
      />

      {/* App Install / APK Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-[#181B22] border border-slate-700 rounded-2xl p-5 shadow-2xl">
            <h4 className="text-base font-bold text-white">အကောင့်မှ ထွက်ခွာမည်လား</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              အကောင့်မှ ထွက်ခွာပါက လက်ရှိ Session ကို ရှင်းလင်းမည် ဖြစ်ပါသည်။ (Remember Me ပြုလုပ်ထားပါက Employee ID ကို သိမ်းဆည်းထားပါမည်)
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1.5 text-slate-300 hover:text-white text-xs font-medium"
              >
                မထွက်ပါ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-colors"
              >
                ထွက်မည်
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div className="p-4 text-center border-t border-slate-800/60 mt-auto">
        <p className="text-[11px] text-slate-500">RexGo • Phase 1 Native Foundation</p>
      </div>
    </div>
  );
};
