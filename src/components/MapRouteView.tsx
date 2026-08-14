import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Navigation,
  Phone,
  CheckCircle2,
  Clock,
  Ban,
  Compass,
  MapPin,
  Sparkles,
  Zap,
  RotateCw,
  Search,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  AlertTriangle,
  Package,
  DollarSign
} from 'lucide-react';
import { DeliveryParcel, DeliveryStatus, RoutePlan, RouteStop } from '../types';
import { optimizeDeliveryRoute, DEFAULT_HUB } from '../utils/routeOptimizer';

interface MapRouteViewProps {
  deliveries: DeliveryParcel[];
  onNavigateBack: () => void;
  onUpdateStatus: (deliveryId: string, status: DeliveryStatus) => void;
  onSelectCustomerDetail?: (delivery: DeliveryParcel) => void;
}

export const MapRouteView: React.FC<MapRouteViewProps> = ({
  deliveries,
  onNavigateBack,
  onUpdateStatus,
  onSelectCustomerDetail
}) => {
  const [routePlan, setRoutePlan] = useState<RoutePlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationTimeMs, setCalculationTimeMs] = useState(24);
  const [selectedStopNumber, setSelectedStopNumber] = useState<number | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed' | 'unlocated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [callingPhone, setCallingPhone] = useState<string | null>(null);

  // Compute Route Plan on Mount or Delivery Changes
  const runRouteOptimization = async () => {
    setIsCalculating(true);
    const startT = performance.now();
    try {
      const plan = await optimizeDeliveryRoute(deliveries, DEFAULT_HUB);
      setRoutePlan(plan);
      const elapsed = Math.round(performance.now() - startT);
      setCalculationTimeMs(elapsed);
      // Select first pending stop as default active
      const firstPending = plan.stops.find(s => s.parcel.status === 'Pending');
      if (firstPending) {
        setSelectedStopNumber(firstPending.stopNumber);
      } else if (plan.stops.length > 0) {
        setSelectedStopNumber(plan.stops[0].stopNumber);
      }
    } catch (e) {
      console.error('Route calculation failed', e);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    runRouteOptimization();
  }, [deliveries]);

  // Find the active "Next Stop" (first pending stop)
  const nextStop = useMemo(() => {
    if (!routePlan) return null;
    return routePlan.stops.find(s => s.parcel.status === 'Pending') || routePlan.stops[0] || null;
  }, [routePlan]);

  const activeStop = useMemo(() => {
    if (!routePlan) return null;
    if (selectedStopNumber !== null) {
      return routePlan.stops.find(s => s.stopNumber === selectedStopNumber) || nextStop;
    }
    return nextStop;
  }, [routePlan, selectedStopNumber, nextStop]);

  // Filter stops for list
  const filteredStops = useMemo(() => {
    if (!routePlan) return [];
    const q = searchQuery.toLowerCase().trim();
    return routePlan.stops.filter(s => {
      if (filterTab === 'pending' && s.parcel.status !== 'Pending') return false;
      if (filterTab === 'completed' && s.parcel.status !== 'Completed') return false;

      if (!q) return true;
      return (
        s.parcel.customerName.toLowerCase().includes(q) ||
        s.parcel.township.toLowerCase().includes(q) ||
        s.parcel.trackingNo.toLowerCase().includes(q) ||
        (s.parcel.phone && s.parcel.phone.includes(q))
      );
    });
  }, [routePlan, filterTab, searchQuery]);

  // Map Bounds Projection calculation for SVG rendering
  const mapBounds = useMemo(() => {
    if (!routePlan || routePlan.stops.length === 0) {
      return { minLat: 16.74, maxLat: 16.92, minLng: 96.10, maxLng: 96.22 };
    }
    let minLat = DEFAULT_HUB.lat;
    let maxLat = DEFAULT_HUB.lat;
    let minLng = DEFAULT_HUB.lng;
    let maxLng = DEFAULT_HUB.lng;

    routePlan.stops.forEach(s => {
      if (s.parcel.latitude && s.parcel.longitude) {
        minLat = Math.min(minLat, s.parcel.latitude);
        maxLat = Math.max(maxLat, s.parcel.latitude);
        minLng = Math.min(minLng, s.parcel.longitude);
        maxLng = Math.max(maxLng, s.parcel.longitude);
      }
    });

    const padLat = (maxLat - minLat) * 0.1 || 0.02;
    const padLng = (maxLng - minLng) * 0.1 || 0.02;

    return {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLng: minLng - padLng,
      maxLng: maxLng + padLng
    };
  }, [routePlan]);

  // Project GPS lat/lng to SVG viewBox (0..600 x 0..400)
  const projectCoords = (lat: number, lng: number) => {
    const svgW = 600;
    const svgH = 400;
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng || 1)) * svgW;
    // Invert Y because latitude goes north (up) but SVG Y goes down
    const y = svgH - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat || 1)) * svgH;
    return { x, y };
  };

  // Generate Polyline points for route
  const polylineSvgPoints = useMemo(() => {
    if (!routePlan || routePlan.stops.length === 0) return '';
    const start = projectCoords(DEFAULT_HUB.lat, DEFAULT_HUB.lng);
    const pts = [`${start.x},${start.y}`];

    routePlan.stops.forEach(s => {
      if (s.parcel.latitude && s.parcel.longitude) {
        const pt = projectCoords(s.parcel.latitude, s.parcel.longitude);
        pts.push(`${pt.x},${pt.y}`);
      }
    });
    return pts.join(' ');
  }, [routePlan, mapBounds]);

  const handleCall = (phone?: string) => {
    if (!phone) return;
    setCallingPhone(phone);
    setTimeout(() => setCallingPhone(null), 2500);
  };

  const handleOpenGoogleMapsNav = (lat?: number | null, lng?: number | null, address?: string) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full bg-[#0B0D13] text-slate-100 flex flex-col justify-between overflow-hidden select-none relative">
      
      {/* 1. Header Toolbar */}
      <div className="bg-[#121620]/95 backdrop-blur-md px-4 py-3 border-b border-slate-800/80 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>၄၀+ ပါဆယ် လမ်းကြောင်းဆွဲစနစ်</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">
                TSP Engine
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">40+ Parcel Auto Route Optimizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Re-calculate Route Button */}
          <button
            onClick={runRouteOptimization}
            disabled={isCalculating}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all disabled:opacity-50"
            title="Re-optimize Route"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Optimize</span>
          </button>

          <span className="px-2 py-1 rounded-lg bg-black/60 border border-slate-800 font-mono text-[10px] text-emerald-400 font-bold">
            ⚡ {calculationTimeMs}ms
          </span>
        </div>
      </div>

      {/* Direct Call Toast */}
      {callingPhone && (
        <div className="absolute top-14 inset-x-4 z-30 p-2.5 rounded-xl bg-emerald-950/95 border border-emerald-500 text-emerald-300 text-xs flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Native Android Intent: <strong>tel:{callingPhone}</strong> သို့ ချိတ်ဆက်နေပါသည်...</span>
          </div>
        </div>
      )}

      {/* 2. Interactive SVG Vector Map Viewport */}
      <div
        className="relative flex-1 bg-[#090B10] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Map Grid Pattern Background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        {/* Floating Map Zoom & Reset Controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-[#121622]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
          <button
            onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1.0);
              setMapPan({ x: 0, y: 0 });
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-400 transition-all"
            title="Reset Map Center"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Route Stats Metric Chip on Map */}
        {routePlan && (
          <div className="absolute top-3 left-3 z-10 bg-[#121622]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-3 text-[11px] shadow-xl">
            <div>
              <span className="text-slate-400 block text-[9px]">စုစုပေါင်း အကွာအဝေး</span>
              <span className="font-mono font-bold text-cyan-400">{routePlan.totalDistanceKm} km</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800"></div>
            <div>
              <span className="text-slate-400 block text-[9px]">ခန့်မှန်းကြာချိန်</span>
              <span className="font-mono font-bold text-amber-400">
                {Math.floor(routePlan.totalEstimatedTimeMinutes / 60)}h {routePlan.totalEstimatedTimeMinutes % 60}m
              </span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800"></div>
            <div>
              <span className="text-slate-400 block text-[9px]">မှတ်တိုင် စုစုပေါင်း</span>
              <span className="font-mono font-bold text-emerald-400">{routePlan.totalStops} Stops</span>
            </div>
          </div>
        )}

        {/* SVG Container with Zoom and Pan Transforms */}
        <div
          className="w-full h-full transition-transform duration-75 flex items-center justify-center"
          style={{
            transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          <svg
            viewBox="0 0 600 400"
            className="w-full h-full max-w-full max-h-full overflow-visible"
          >
            {/* Simulated Road Arteries (Yangon Main Expressways) */}
            <g stroke="#1A2234" strokeWidth="3" fill="none" opacity="0.6">
              <path d="M 50,200 Q 250,180 550,220" />
              <path d="M 280,30 Q 300,200 320,380" />
              <path d="M 120,80 Q 300,160 480,320" />
              <path d="M 450,50 Q 350,220 150,350" />
            </g>

            {/* Calculated Delivery Route Polyline */}
            {polylineSvgPoints && (
              <polyline
                points={polylineSvgPoints}
                fill="none"
                stroke="#00E5FF"
                strokeWidth="2.5"
                strokeDasharray="4,3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80 shadow-lg"
              />
            )}

            {/* Central Start Hub Pin */}
            {(() => {
              const hubPt = projectCoords(DEFAULT_HUB.lat, DEFAULT_HUB.lng);
              return (
                <g transform={`translate(${hubPt.x}, ${hubPt.y})`}>
                  <circle r="14" fill="#00E5FF" opacity="0.2" className="animate-ping" />
                  <circle r="9" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="2" />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight="bold"
                    fill="#000000"
                    fontFamily="monospace"
                  >
                    HUB
                  </text>
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="bold"
                    fill="#00E5FF"
                    fontFamily="sans-serif"
                  >
                    Sule Central
                  </text>
                </g>
              );
            })()}

            {/* Individual Numbered Stop Markers */}
            {routePlan?.stops.map((stop) => {
              if (!stop.parcel.latitude || !stop.parcel.longitude) return null;
              const pt = projectCoords(stop.parcel.latitude, stop.parcel.longitude);
              const isSelected = activeStop?.stopNumber === stop.stopNumber;
              const isCompleted = stop.parcel.status === 'Completed';
              const isSkipped = stop.parcel.status === 'Skipped';

              let pinColor = '#00E5FF'; // Default pending cyan
              if (isCompleted) pinColor = '#10B981'; // Emerald
              else if (isSkipped) pinColor = '#EF4444'; // Rose
              else if (isSelected) pinColor = '#F59E0B'; // Amber next

              return (
                <g
                  key={stop.stopNumber}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStopNumber(stop.stopNumber);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Pulsing Radar Ring for Active Next Stop */}
                  {isSelected && (
                    <circle r="16" fill={pinColor} opacity="0.3" className="animate-ping" />
                  )}

                  {/* Marker Circle */}
                  <circle
                    r={isSelected ? "11" : "8.5"}
                    fill={pinColor}
                    stroke="#0B0D13"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125 shadow-md"
                  />

                  {/* Stop Sequence Number */}
                  <text
                    x="0"
                    y={isSelected ? "3.5" : "3"}
                    textAnchor="middle"
                    fontSize={isSelected ? "8" : "7"}
                    fontWeight="extrabold"
                    fill="#000000"
                    fontFamily="monospace"
                  >
                    {stop.stopNumber}
                  </text>

                  {/* Township Floating Tag on hover/selected */}
                  {isSelected && (
                    <g transform="translate(0, -18)">
                      <rect
                        x="-35"
                        y="-10"
                        width="70"
                        height="14"
                        rx="4"
                        fill="#121622"
                        stroke={pinColor}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fontSize="7"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        fontFamily="sans-serif"
                      >
                        #{stop.stopNumber} {stop.parcel.township}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Active "Next Stop" Floating Control Card */}
      {activeStop && (
        <div className="bg-[#141824] border-t-2 border-cyan-500/50 p-3.5 space-y-2.5 z-20 shrink-0 shadow-2xl">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-black font-extrabold text-xs flex items-center justify-center font-mono">
                {activeStop.stopNumber}
              </span>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  နောက်ထပ် ပို့ဆောင်ရမည့် နေရာ (Active Stop)
                </span>
                <h4 className="font-bold text-white text-sm leading-tight">
                  {activeStop.parcel.customerName}
                </h4>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-amber-400 font-bold block font-mono">
                ETA: {activeStop.estimatedArrival}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                +{activeStop.distanceFromPrevKm} km ({activeStop.travelTimeMins} mins)
              </span>
            </div>
          </div>

          {/* Address & COD amount */}
          <div className="flex items-center justify-between text-xs bg-black/40 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-start gap-1.5 text-slate-300 text-[11px] pr-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span className="line-clamp-1">
                <strong className="text-cyan-300">{activeStop.parcel.township}</strong> — {activeStop.parcel.address}
              </span>
            </div>

            {activeStop.parcel.codAmount > 0 ? (
              <span className="shrink-0 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">
                COD: {activeStop.parcel.codAmount.toLocaleString()} Ks
              </span>
            ) : (
              <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Prepaid
              </span>
            )}
          </div>

          {/* 3 Main Action Buttons: Direct Call, Native Navigation, Status Done */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            {/* 1. Direct Call */}
            <button
              onClick={() => handleCall(activeStop.parcel.phone || activeStop.parcel.normalizedPhone)}
              className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Call ({activeStop.parcel.phone?.slice(-4) || 'Ph'})</span>
            </button>

            {/* 2. Google Maps Navigation Intent */}
            <button
              onClick={() =>
                handleOpenGoogleMapsNav(
                  activeStop.parcel.latitude,
                  activeStop.parcel.longitude,
                  activeStop.parcel.address + ' ' + activeStop.parcel.township
                )
              }
              className="h-10 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Navigate</span>
            </button>

            {/* 3. Mark Done / Delivered */}
            <button
              onClick={() => {
                onUpdateStatus(activeStop.parcel.id, 'Completed');
                // Move to next pending stop
                if (routePlan) {
                  const nextPending = routePlan.stops.find(
                    s => s.parcel.status === 'Pending' && s.stopNumber !== activeStop.stopNumber
                  );
                  if (nextPending) setSelectedStopNumber(nextPending.stopNumber);
                }
              }}
              className="h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Collapsible 40+ Turn-by-Turn Stop Sequence Drawer */}
      <div className="bg-[#10141E] border-t border-slate-800 z-20 shrink-0">
        <div
          onClick={() => setIsListExpanded(!isListExpanded)}
          className="p-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">
              လမ်းကြောင်း အစီအစဉ် ({filteredStops.length} Stops)
            </span>
            <span className="text-[10px] text-slate-500">
              {routePlan?.completedStops || 0} Delivered / {routePlan?.pendingStops || 0} Pending
            </span>
          </div>

          <div className="flex items-center gap-2">
            {routePlan?.unlocatedParcels && routePlan.unlocatedParcels.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                {routePlan.unlocatedParcels.length} Unlocated
              </span>
            )}
            {isListExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Expanded Stop List */}
        {isListExpanded && (
          <div className="p-3 pt-0 max-h-48 overflow-y-auto space-y-1.5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold pb-2">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTab === 'all' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                All ({routePlan?.stops.length || 0})
              </button>
              <button
                onClick={() => setFilterTab('pending')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTab === 'pending' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Pending ({routePlan?.pendingStops || 0})
              </button>
              <button
                onClick={() => setFilterTab('completed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTab === 'completed' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Done ({routePlan?.completedStops || 0})
              </button>
            </div>

            {/* Stops Rows */}
            {filteredStops.map((stop) => {
              const isSelected = activeStop?.stopNumber === stop.stopNumber;
              const isCompleted = stop.parcel.status === 'Completed';

              return (
                <div
                  key={stop.stopNumber}
                  onClick={() => setSelectedStopNumber(stop.stopNumber)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500 text-white'
                      : isCompleted
                      ? 'bg-[#121915] border-emerald-500/30 text-slate-400'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isSelected
                          ? 'bg-cyan-500 text-black'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {stop.stopNumber}
                    </span>
                    <div>
                      <div className="font-bold text-[11px] leading-tight text-white">
                        {stop.parcel.customerName}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {stop.parcel.township} • {stop.parcel.address}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[10px] font-bold text-amber-400 block">
                      {stop.estimatedArrival}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      +{stop.distanceFromPrevKm} km
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
