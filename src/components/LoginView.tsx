import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, BadgeCheck, Lock, Eye, EyeOff, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { UserSessionState } from '../types';

interface LoginViewProps {
  session: UserSessionState;
  onLoginSuccess: (employeeId: string, rememberMe: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  session,
  onLoginSuccess
}) => {
  const [employeeId, setEmployeeId] = useState(session.isRememberMe ? session.employeeId : '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(session.isRememberMe);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    if (session.isRememberMe && session.employeeId) {
      setEmployeeId(session.employeeId);
      setRememberMe(true);
    }
  }, [session]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!employeeId.trim()) {
      setErrorMessage('Employee ID ထည့်သွင်းပေးပါ');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Password စကားဝှက် ထည့်သွင်းပေးပါ');
      return;
    }

    setIsLoading(true);

    // Simulate clean local session login (Phase 1 decoupled local auth)
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(employeeId.trim(), rememberMe);
    }, 600);
  };

  return (
    <div className="w-full h-full bg-[#0F1115] text-slate-100 flex flex-col justify-between p-6 overflow-y-auto select-none">
      <div className="w-full">
        {/* Top Header */}
        <div className="flex items-center gap-3 pt-3 pb-6">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">RexGo</h2>
            <p className="text-xs text-slate-400 font-medium">Delivery Rider Portal</p>
          </div>
        </div>

        {/* Title & Myanmar Helper */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white tracking-wide">အကောင့်ဝင်ရောက်ရန်</h3>
          <p className="text-xs text-slate-400 mt-1">
            တာဝန်ကျ ဝန်ထမ်း အချက်အလက်များ ဖြည့်သွင်းပါ
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Field 1: Employee ID (Label on top, strictly NO inside placeholder) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Employee ID <span className="text-slate-500 font-normal">(ဝန်ထမ်း အိုင်ဒီ)</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-cyan-400 pointer-events-none">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full h-12 bg-[#181B22] border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 text-sm font-medium text-white outline-none transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Field 2: Password (Label on top, strictly NO inside placeholder) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Password <span className="text-slate-500 font-normal">(စကားဝှက်)</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-cyan-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full h-12 bg-[#181B22] border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-11 text-sm font-medium text-white outline-none transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-[#00E5FF] border-[#00E5FF] text-black'
                    : 'bg-[#181B22] border-slate-700'
                }`}
              >
                {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs font-medium text-slate-300">
                Remember Me
              </span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-4 bg-[#00E5FF] hover:bg-[#33ebff] active:scale-[0.99] disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center transition-all shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>

      {/* Footer Powered By */}
      <div className="mt-8 text-center pt-4 border-t border-slate-800/60">
        <p className="text-[11px] text-slate-500">Powered by</p>
        <p className="text-xs font-semibold text-cyan-400 mt-0.5">Myo Thant Zaw</p>
      </div>

      {/* Forgot Password Dialog */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-[#181B22] border border-slate-700 rounded-2xl p-5 shadow-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">စကားဝှက် မေ့နေပါသလား</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                စကားဝှက် ပြန်လည်ရယူရန် သက်ဆိုင်ရာ System Administrator သို့မဟုတ် Dispatch Team ထံသို့ ဆက်သွယ်ပေးပါ။
              </p>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors"
                >
                  နားလည်ပါပြီ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
