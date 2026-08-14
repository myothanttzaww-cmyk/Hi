import React from 'react';
import { Folder, HardDrive, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { REXGO_STORAGE_STRUCTURE } from '../data/androidFiles';

interface StorageExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageExplorerModal: React.FC<StorageExplorerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const rexGoRoot = REXGO_STORAGE_STRUCTURE.children?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-[#181B22] border border-slate-700 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">RexGo Local Scoped Storage</h3>
              <p className="text-xs text-slate-400 font-mono">Downloads/RexGo/</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
          <p className="font-medium">
            ✅ Clean Android Scoped Storage compliant without <code className="bg-cyan-950 px-1 py-0.5 rounded text-cyan-200">MANAGE_EXTERNAL_STORAGE</code>. Initialized automatically on first launch.
          </p>
        </div>

        {/* Folder Tree List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
          {rexGoRoot?.children?.map((folder, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#0F1115] border border-slate-800/90 hover:border-cyan-500/40 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-colors">
                  <Folder className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {folder.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono">
                      Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{folder.description}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            7 Subdirectories Created
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-xl transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
