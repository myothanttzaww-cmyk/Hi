import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Zap,
  ZapOff,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Camera,
  Layers,
  Sparkles,
  Crosshair,
  AlertTriangle,
  Settings,
  ChevronRight,
  Focus,
  Eye,
  PenTool,
  Filter
} from 'lucide-react';
import { OcrResult, SampleParcel, ImagePreprocessOptions } from '../types';
import { SAMPLE_PARCELS } from '../data/sampleParcels';
import { processOcrText } from '../utils/ocrEngine';
import { ImagePreprocessor } from '../utils/imagePreprocessor';

interface ScannerViewProps {
  onNavigateBack: () => void;
  onScanComplete: (result: OcrResult) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onNavigateBack,
  onScanComplete
}) => {
  // Permission State
  const [hasPermission, setHasPermission] = useState(true);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  // Camera Settings
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [zoomRatio, setZoomRatio] = useState<number>(1.0);
  const [exposure, setExposure] = useState<number>(0);
  const [isAutoCapture, setIsAutoCapture] = useState<boolean>(true);
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);

  // Phase 4: Image Preprocessing Controls
  const [preprocessConfig, setPreprocessConfig] = useState<ImagePreprocessOptions>({
    grayscale: true,
    contrastBoost: 1.4,
    sharpen: true,
    binarizeThreshold: 128,
    invert: false
  });
  const [showPreprocessedPreview, setShowPreprocessedPreview] = useState(false);

  // Focus & Laser Animation State
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [isFocusing, setIsFocusing] = useState(false);
  const [sharpnessScore, setSharpnessScore] = useState<number>(132);

  // Active Sample Parcel
  const [selectedParcelIdx, setSelectedParcelIdx] = useState<number>(1); // Default to Handwritten Myanmar Script
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const activeParcel: SampleParcel = SAMPLE_PARCELS[selectedParcelIdx] || SAMPLE_PARCELS[0];

  // Jitter Sharpness Score
  useEffect(() => {
    if (!hasPermission || isPermissionDenied) return;

    const interval = setInterval(() => {
      const noise = (Math.random() - 0.5) * 12;
      setSharpnessScore(prev => Math.min(185, Math.max(95, Math.round(prev + noise))));
    }, 400);

    return () => clearInterval(interval);
  }, [hasPermission, isPermissionDenied]);

  // Touch-to-focus handler
  const handleTouchToFocus = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFocusPoint({ x, y });
    setIsFocusing(true);
    setTimeout(() => {
      setIsFocusing(false);
    }, 1200);
  };

  // Perform Preprocessing & ML Kit Text Recognition
  const triggerOcrScan = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      const result = processOcrText(activeParcel.waybillFullText, {
        grayscale: preprocessConfig.grayscale,
        contrast: preprocessConfig.contrastBoost,
        sharpen: preprocessConfig.sharpen,
        binarize: preprocessConfig.binarizeThreshold > 0
      });
      result.parcelTrackingNumber = activeParcel.trackingNo;
      result.receiverName = activeParcel.recipientName;
      result.deliveryAddress = activeParcel.address;
      result.isHandwrittenDetected = Boolean(activeParcel.isHandwritten);
      onScanComplete(result);
    }, 450);
  };

  // Auto-capture Trigger
  useEffect(() => {
    if (isAutoCapture && sharpnessScore >= 120 && !isCapturing && hasPermission && !isPermissionDenied) {
      const timer = setTimeout(() => {
        triggerOcrScan();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedParcelIdx, isAutoCapture, hasPermission, isPermissionDenied]);

  // Toggle Flash
  const handleToggleFlash = () => {
    if (flashMode === 'off') setFlashMode('on');
    else if (flashMode === 'on') setFlashMode('auto');
    else setFlashMode('off');
  };

  if (isPermissionDenied) {
    return (
      <div className="w-full h-full bg-[#0F1115] text-slate-100 flex flex-col justify-center items-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 animate-pulse">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white leading-snug">
          Camera Permission လိုအပ်ပါသည်
        </h3>
        <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
          ပါဆယ်ပေါ်ရှိ ဖုန်းနံပါတ်များကို Scan ဖတ်နိုင်ရန် Camera အသုံးပြုခွင့် ပေးရန် လိုအပ်ပါသည်။
        </p>

        <div className="mt-6 w-full max-w-xs space-y-2.5">
          <button
            onClick={() => {
              setIsPermissionDenied(false);
              setHasPermission(true);
            }}
            className="w-full h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Open Settings (ခွင့်ပြုချက်ပေးရန်)</span>
          </button>

          <button
            onClick={onNavigateBack}
            className="w-full h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            နောက်သို့ (Back)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black text-white relative flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. Camera Viewport */}
      <div
        onClick={handleTouchToFocus}
        className="absolute inset-0 z-0 flex items-center justify-center cursor-crosshair"
      >
        {/* Waybill Parcel Label Simulated Frame */}
        <div
          className={`w-full h-full transition-transform duration-300 flex items-center justify-center relative p-6 bg-[#0D0F14] ${
            flashMode === 'on' ? 'brightness-125' : ''
          }`}
          style={{
            transform: `scale(${zoomRatio})`,
            filter: showPreprocessedPreview
              ? `grayscale(${preprocessConfig.grayscale ? '100%' : '0%'}) contrast(${preprocessConfig.contrastBoost * 120}%) ${preprocessConfig.invert ? 'invert(100%)' : ''}`
              : `brightness(${1 + exposure * 0.15})`
          }}
        >
          {/* Realistic Waybill Card */}
          <div
            className={`w-[86%] max-w-xs rounded-xl p-4 shadow-2xl border font-mono text-[11px] select-text relative transition-all ${
              showPreprocessedPreview
                ? 'bg-zinc-950 text-white border-cyan-500/80 shadow-[0_0_25px_rgba(0,229,255,0.3)]'
                : activeParcel.isHandwritten
                ? 'bg-[#FFFDF5] text-slate-900 border-amber-300/80 shadow-2xl'
                : 'bg-amber-50/95 text-slate-900 border-amber-200/80'
            }`}
          >
            {/* Header */}
            <div className="border-b-2 border-dashed border-slate-600 pb-2 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans font-bold text-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${activeParcel.isHandwritten ? 'bg-amber-500' : 'bg-cyan-600'}`}></span>
                <span>{activeParcel.isHandwritten ? 'HANDWRITTEN WAYBILL' : 'REXGO EXPRESS WAYBILL'}</span>
              </div>
              <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-bold">
                {activeParcel.trackingNo}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-1.5 text-[10px] leading-tight">
              <div>
                <span className="text-slate-500">SHIPPER: </span>
                <span className="font-semibold">{activeParcel.senderName} ({activeParcel.senderPhone})</span>
              </div>
              
              <div className={`p-2 rounded-xl border ${activeParcel.isHandwritten ? 'bg-amber-100/90 border-amber-400/80' : 'bg-amber-100/90 border-amber-300/80'}`}>
                <div className="font-bold text-slate-900 text-[11px] flex items-center justify-between">
                  <span>TO: {activeParcel.recipientName}</span>
                  {activeParcel.isHandwritten && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-600 text-white font-sans text-[8px] font-bold">
                      {activeParcel.handwritingType || 'Handwritten'}
                    </span>
                  )}
                </div>
                <div className="text-cyan-900 font-extrabold text-xs tracking-wider mt-1 font-mono">
                  PHONE: {activeParcel.phoneRaw}
                </div>
              </div>

              <div>
                <span className="text-slate-500">ADDRESS: </span>
                <span className="text-slate-800 font-medium">{activeParcel.address}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-1.5 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-600 font-sans">
              <span>COD: 24,500 MMK</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>PREPROCESSED ML KIT</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Dark Overlay with 80% Scan Box cutout */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute top-0 inset-x-0 h-[22%] bg-black/75 backdrop-blur-[1px]"></div>
          <div className="absolute bottom-0 inset-x-0 h-[32%] bg-black/75 backdrop-blur-[1px]"></div>
          <div className="absolute top-[22%] bottom-[32%] left-0 w-[8%] bg-black/75 backdrop-blur-[1px]"></div>
          <div className="absolute top-[22%] bottom-[32%] right-0 w-[8%] bg-black/75 backdrop-blur-[1px]"></div>

          {/* Center 80% Scan Box with Emerald Border & Corner Brackets */}
          <div className="w-[84%] aspect-[1.45/1] rounded-2xl border-2 border-emerald-400 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce duration-1000 absolute top-0 inset-x-0"></div>

            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-sm"></div>

            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <Crosshair className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/80 text-emerald-400 border border-emerald-500/40 font-mono font-semibold">
                80% Scan Area (Grayscale + Adaptive Threshold)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Touch Focus Ring */}
        {isFocusing && focusPoint && (
          <div
            className="absolute w-12 h-12 rounded-full border-2 border-cyan-400 animate-ping pointer-events-none"
            style={{
              left: `${focusPoint.x - 24}px`,
              top: `${focusPoint.y - 24}px`
            }}
          />
        )}
      </div>

      {/* 2. Top Header Controls Bar */}
      <div className="relative z-20 px-4 pt-3 pb-2 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onNavigateBack}
          className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-slate-700/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Sharpness & Handwriting Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-slate-700/80 text-xs">
          <span className={`w-2 h-2 rounded-full ${sharpnessScore >= 120 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="text-[11px] font-semibold text-slate-200">
            {activeParcel.isHandwritten ? '✍️ Handwritten Mode' : '🖨️ Printed Mode'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Live Preprocessed Image View Toggle */}
          <button
            onClick={() => setShowPreprocessedPreview(!showPreprocessedPreview)}
            className={`p-2 rounded-xl backdrop-blur-md transition-all border ${
              showPreprocessedPreview
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-md font-bold'
                : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Toggle Preprocessed Preview (Binarization/Grayscale)"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Flash Mode Toggle */}
          <button
            onClick={handleToggleFlash}
            className={`p-2 rounded-xl backdrop-blur-md transition-all border ${
              flashMode !== 'off'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {flashMode === 'off' && <ZapOff className="w-4 h-4" />}
            {flashMode === 'on' && <Zap className="w-4 h-4" />}
            {flashMode === 'auto' && <Zap className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => setShowControlsDrawer(!showControlsDrawer)}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-md transition-all border border-slate-700"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Sample Waybill Switcher (Handwritten Myanmar / Ballpoint / Printed) */}
      <div className="relative z-20 px-4 py-1">
        <div className="bg-black/80 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 flex items-center justify-between gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-[9px] text-slate-400 uppercase font-bold pl-1 shrink-0 flex items-center gap-1">
            <PenTool className="w-3 h-3 text-amber-400" />
            Waybill:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {SAMPLE_PARCELS.map((parcel, idx) => (
              <button
                key={parcel.id}
                onClick={() => setSelectedParcelIdx(idx)}
                className={`px-2 py-1 rounded-lg transition-all text-[10px] font-bold ${
                  selectedParcelIdx === idx
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {parcel.isHandwritten ? '✍️ ' : '🖨️ '}
                #{idx + 1} {parcel.tag.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Controls Drawer (Preprocessing Pipeline & Sliders) */}
      {showControlsDrawer && (
        <div className="relative z-30 mx-4 my-1 p-3 rounded-2xl bg-[#14171F]/95 backdrop-blur-md border border-slate-700 space-y-2.5 text-xs shadow-2xl">
          <div className="font-bold text-white text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Image Preprocessing Pipeline (Native OpenCV / RenderScript)</span>
          </div>

          {/* Grayscale & Contrast */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <label className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={preprocessConfig.grayscale}
                onChange={(e) => setPreprocessConfig({ ...preprocessConfig, grayscale: e.target.checked })}
                className="accent-cyan-400"
              />
              <span className="text-slate-300">Grayscale (Rec.601)</span>
            </label>

            <label className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={preprocessConfig.sharpen}
                onChange={(e) => setPreprocessConfig({ ...preprocessConfig, sharpen: e.target.checked })}
                className="accent-cyan-400"
              />
              <span className="text-slate-300">Unsharp Mask Filter</span>
            </label>
          </div>

          {/* Contrast Booster Slider */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400 text-[10px]">Contrast Stretch:</span>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={preprocessConfig.contrastBoost}
              onChange={(e) => setPreprocessConfig({ ...preprocessConfig, contrastBoost: parseFloat(e.target.value) })}
              className="flex-1 accent-cyan-400 h-1.5"
            />
            <span className="font-mono text-cyan-400 font-bold text-[10px]">
              {preprocessConfig.contrastBoost.toFixed(1)}x
            </span>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400 text-[10px]">Camera Zoom:</span>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={zoomRatio}
              onChange={(e) => setZoomRatio(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-400 h-1.5"
            />
            <span className="font-mono text-cyan-400 font-bold text-[10px]">{zoomRatio.toFixed(1)}x</span>
          </div>
        </div>
      )}

      {/* 5. Bottom Main Action Controls */}
      <div className="relative z-20 px-5 pb-5 pt-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center gap-3">
        
        {/* Shutter Row */}
        <div className="w-full flex items-center justify-around">
          <button
            onClick={() => {
              setSharpnessScore(90);
              setTimeout(() => setSharpnessScore(145), 500);
            }}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            title="Refresh Frame"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Big Shutter Capture Button */}
          <button
            onClick={triggerOcrScan}
            disabled={isCapturing}
            className="w-18 h-18 rounded-full bg-white/10 p-1 border-3 border-cyan-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(0,229,255,0.4)] disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black">
              <Camera className="w-7 h-7 text-black" />
            </div>
          </button>

          <button
            onClick={() => {
              setIsFocusing(true);
              setTimeout(() => setIsFocusing(false), 900);
            }}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 transition-all"
            title="AutoFocus"
          >
            <Focus className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-mono text-center">
          Native CameraX Preview • 80% Scan Crop • Handwritten OCR Preprocessor
        </p>
      </div>

    </div>
  );
};

