import React, { useState } from 'react';
import {
  X,
  FileCode,
  Layers,
  Cpu,
  FolderTree,
  ShieldCheck,
  Database,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { ANDROID_FILES, DEVICE_SPECS } from '../data/androidFiles';
import { CodeFile } from '../types';

interface ArchitectureViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureViewer: React.FC<ArchitectureViewerProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ANDROID_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'architecture' | 'device' | 'checklist'>('files');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="w-full max-w-5xl h-[88vh] bg-[#0F1115] border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#181B22] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">RexGo Native Android Architecture</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                  com.rexgo.delivery
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kotlin • Jetpack Compose • Material 3 • Hilt • Room • DataStore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center bg-[#0F1115] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'files'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kotlin Sources
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'architecture'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Clean Architecture
              </button>
              <button
                onClick={() => setActiveTab('device')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'device'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Redmi Turbo 4 Pro
              </button>
              <button
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'checklist'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Phase 1 Audit
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* TAB 1: KOTLIN FILES */}
          {activeTab === 'files' && (
            <div className="flex-1 flex overflow-hidden">
              {/* File List Sidebar */}
              <div className="w-72 bg-[#14171F] border-r border-slate-800 p-3 overflow-y-auto space-y-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                  Android Codebase
                </p>
                {ANDROID_FILES.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-all ${
                      selectedFile.name === file.name
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <FileCode className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{file.category}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="flex-1 bg-[#090A0D] flex flex-col overflow-hidden">
                <div className="px-5 py-2.5 bg-[#14171F]/80 border-b border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-medium text-cyan-400">
                      {selectedFile.path}
                    </span>
                    <p className="text-[11px] text-slate-400">{selectedFile.description}</p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed">
                  <pre>{selectedFile.code}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLEAN ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-3 gap-4">
                
                {/* Layer 1: Presentation */}
                <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2.5 text-cyan-400">
                    <Layers className="w-5 h-5" />
                    <h4 className="text-sm font-bold">Presentation Layer (UI)</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Jetpack Compose Material 3 declarative UI with unidirectional data flow (UDF).
                  </p>
                  <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-300">
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • SplashScreen (2s animation)
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • LoginScreen & ViewModel
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • HomeScreen & Dashboard
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • SettingsScreen (Locked Dark)
                    </div>
                  </div>
                </div>

                {/* Layer 2: Domain Layer */}
                <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <h4 className="text-sm font-bold">Domain Layer (Business)</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pure Kotlin business logic & repository contracts without platform dependencies.
                  </p>
                  <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-300">
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • AuthRepository (Interface)
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • UserSession (Domain Model)
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • Permission Contracts
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • Decoupled from Online Auth
                    </div>
                  </div>
                </div>

                {/* Layer 3: Data Layer */}
                <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2.5 text-purple-400">
                    <Database className="w-5 h-5" />
                    <h4 className="text-sm font-bold">Data Layer (Local Storage)</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Local-first persistence using DataStore Preferences & Room Database scaffolding.
                  </p>
                  <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-300">
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • SessionManager (DataStore)
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • LocalStorageManager (7 Folders)
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • RexGoDatabase (Room Scaffold)
                    </div>
                    <div className="p-2 rounded-lg bg-[#0F1115] border border-slate-800">
                      • AuthRepositoryImpl
                    </div>
                  </div>
                </div>

              </div>

              {/* Hilt Dependency Injection Diagram */}
              <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Hilt Dependency Injection Graph (SingletonComponent)
                </h4>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0F1115] border border-slate-800">
                    <span className="font-semibold text-cyan-400">AppModule</span>
                    <p className="text-[11px] text-slate-400 mt-1">Provides PermissionManager & CameraModuleScaffold</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F1115] border border-slate-800">
                    <span className="font-semibold text-emerald-400">DatabaseModule</span>
                    <p className="text-[11px] text-slate-400 mt-1">Provides RexGoDatabase (Room Singleton)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F1115] border border-slate-800">
                    <span className="font-semibold text-purple-400">RepositoryModule</span>
                    <p className="text-[11px] text-slate-400 mt-1">Binds AuthRepositoryImpl to AuthRepository</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEVICE SPECS */}
          {activeTab === 'device' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{DEVICE_SPECS.model}</h4>
                    <p className="text-xs text-slate-400">{DEVICE_SPECS.processor} • {DEVICE_SPECS.ram}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0F1115] border border-slate-800">
                    <span className="text-slate-500">Display Refresh Rate</span>
                    <p className="text-sm font-bold text-cyan-400 mt-0.5">{DEVICE_SPECS.refreshRate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F1115] border border-slate-800">
                    <span className="text-slate-500">Operating System</span>
                    <p className="text-sm font-bold text-white mt-0.5">{DEVICE_SPECS.os}</p>
                  </div>
                </div>
              </div>

              {/* Optimization Rules */}
              <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-3">
                  Applied High-Performance Mobile Optimizations
                </h4>
                <div className="space-y-2">
                  {DEVICE_SPECS.optimizations.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0F1115] border border-slate-800 flex items-center gap-3 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHASE 1 COMPLIANCE AUDIT */}
          {activeTab === 'checklist' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="bg-[#181B22] border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-3">
                  Phase 1 Strict Scope Compliance Report
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { title: "App Name & Package", status: "RexGo / com.rexgo.delivery", pass: true },
                    { title: "Material Design 3 Dark Theme", status: "Enforced Pure Dark (#0F1115)", pass: true },
                    { title: "Splash Screen 2s Animation", status: "Fade + Scale Animation Ready", pass: true },
                    { title: "Login Labels on Top", status: "No inside placeholder text", pass: true },
                    { title: "DataStore Session Persistence", status: "Remember Me & Logout Support", pass: true },
                    { title: "Dashboard 6 Cards", status: "UI Scaffolding Active", pass: true },
                    { title: "Scoped Storage (7 Folders)", status: "Downloads/RexGo/ Prepared", pass: true },
                    { title: "Room Database Scaffolding", status: "Customer Entity strictly omitted in P1", pass: true },
                    { title: "Permission Architecture", status: "Modular Ready, 0 intrusive prompts", pass: true },
                    { title: "CameraX Scaffold", status: "Scaffold Ready, 0 camera hardware init", pass: true },
                    { title: "Decoupled Online Auth", status: "Supabase strictly omitted in P1", pass: true },
                    { title: "Myanmar Unicode Support", status: "Accurate Unicode text rendering", pass: true },
                    { title: "Developer Credits", status: "Powered by Myo Thant Zaw", pass: true },
                    { title: "Phase 2 Isolation", status: "No Phase 2 features started", pass: true }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0F1115] border border-slate-800 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 bg-[#181B22] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>RexGo Native Android • Single Activity Jetpack Compose Architecture</span>
          <span className="text-cyan-400 font-medium">Powered by Myo Thant Zaw</span>
        </div>

      </div>
    </div>
  );
};
