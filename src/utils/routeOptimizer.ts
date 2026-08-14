import { DeliveryParcel, RoutePlan, RouteStop } from '../types';

// Yangon & Myanmar Township GPS Reference Table
export const TOWNSHIP_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'ကျောက်တံတား': { lat: 16.7745, lng: 96.1601 },
  'kyauktada': { lat: 16.7745, lng: 96.1601 },
  'ပန်းဘဲတန်း': { lat: 16.7760, lng: 96.1550 },
  'pabedan': { lat: 16.7760, lng: 96.1550 },
  'လသာ': { lat: 16.7735, lng: 96.1490 },
  'latha': { lat: 16.7735, lng: 96.1490 },
  'လမ်းမတော်': { lat: 16.7780, lng: 96.1420 },
  'lanmadaw': { lat: 16.7780, lng: 96.1420 },
  'ဗိုလ်တထောင်': { lat: 16.7730, lng: 96.1700 },
  'botahtaung': { lat: 16.7730, lng: 96.1700 },
  'ဒဂုံ': { lat: 16.7910, lng: 96.1480 },
  'dagon': { lat: 16.7910, lng: 96.1480 },
  'ဗဟန်း': { lat: 16.8080, lng: 96.1550 },
  'bahan': { lat: 16.8080, lng: 96.1550 },
  'စမ်းချောင်း': { lat: 16.8020, lng: 96.1320 },
  'sanchaung': { lat: 16.8020, lng: 96.1320 },
  'ကမာရွတ်': { lat: 16.8290, lng: 96.1280 },
  'kamayut': { lat: 16.8290, lng: 96.1280 },
  'လှိုင်': { lat: 16.8450, lng: 96.1250 },
  'hlaing': { lat: 16.8450, lng: 96.1250 },
  'မရမ်းကုန်း': { lat: 16.8580, lng: 96.1360 },
  'mayangone': { lat: 16.8580, lng: 96.1360 },
  'အင်းစိန်': { lat: 16.8880, lng: 96.1150 },
  'insein': { lat: 16.8880, lng: 96.1150 },
  'တာမွေ': { lat: 16.8040, lng: 96.1720 },
  'tamwe': { lat: 16.8040, lng: 96.1720 },
  'မင်္ဂလာတောင်ညွန့်': { lat: 16.7920, lng: 96.1740 },
  'mingalar taung nyunt': { lat: 16.7920, lng: 96.1740 },
  'သင်္ဃန်းကျွန်း': { lat: 16.8250, lng: 96.1950 },
  'thingangyun': { lat: 16.8250, lng: 96.1950 },
  'တောင်ဥက္ကလာပ': { lat: 16.8520, lng: 96.1780 },
  'south okkalapa': { lat: 16.8520, lng: 96.1780 },
  'မြောက်ဥက္ကလာပ': { lat: 16.8850, lng: 96.1720 },
  'north okkalapa': { lat: 16.8850, lng: 96.1720 },
  'သာကေတ': { lat: 16.7880, lng: 96.2050 },
  'thaketa': { lat: 16.7880, lng: 96.2050 },
  'ဒေါပုံ': { lat: 16.7800, lng: 96.1880 },
  'dawbon': { lat: 16.7800, lng: 96.1880 },
  'အလုံ': { lat: 16.7840, lng: 96.1330 },
  'ahlone': { lat: 16.7840, lng: 96.1330 },
  'ကြည့်မြင်တိုင်': { lat: 16.7950, lng: 96.1260 },
  'kyimyindaing': { lat: 16.7950, lng: 96.1260 },
  'လှိုင်သာယာ': { lat: 16.8580, lng: 96.0680 },
  'hlaing tharyar': { lat: 16.8580, lng: 96.0680 },
  'ချမ်းအေးသာစံ': { lat: 21.9750, lng: 96.0833 },
  'ပဲခူး': { lat: 17.3221, lng: 96.4813 }
};

export const DEFAULT_HUB = {
  name: 'RexGo Central Yangon Hub (Sule Central)',
  lat: 16.7750,
  lng: 96.1580
};

// Haversine distance formula in kilometers
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Apply 1.35 urban road curve correction factor
  return Number((R * c * 1.35).toFixed(2));
}

/**
 * Ensures a parcel has valid coordinates by searching its township or address
 */
export function getOrResolveCoordinates(parcel: DeliveryParcel): { lat: number; lng: number } | null {
  if (parcel.latitude && parcel.longitude && parcel.latitude !== 0 && parcel.longitude !== 0) {
    return { lat: parcel.latitude, lng: parcel.longitude };
  }

  const tspKey = Object.keys(TOWNSHIP_COORDINATES).find(k => {
    return (
      (parcel.township && parcel.township.toLowerCase().includes(k.toLowerCase())) ||
      (parcel.address && parcel.address.toLowerCase().includes(k.toLowerCase()))
    );
  });

  if (tspKey) {
    const base = TOWNSHIP_COORDINATES[tspKey];
    // Add tiny deterministic jitter (+/- 0.003) so distinct houses in same township don't overlap exactly
    const hash = (parcel.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetLat = ((hash % 10) - 5) * 0.0008;
    const offsetLng = (((hash >> 2) % 10) - 5) * 0.0008;
    return {
      lat: Number((base.lat + offsetLat).toFixed(4)),
      lng: Number((base.lng + offsetLng).toFixed(4))
    };
  }

  return null;
}

/**
 * 40+ Parcel Non-Blocking TSP Route Optimization Engine
 * Coroutine Simulation: Runs in asynchronous background task
 */
export async function optimizeDeliveryRoute(
  parcels: DeliveryParcel[],
  startPoint = DEFAULT_HUB
): Promise<RoutePlan> {
  // Yield to event loop to simulate background thread dispatch
  await new Promise(resolve => setTimeout(resolve, 60));

  const locatedParcels: { parcel: DeliveryParcel; lat: number; lng: number }[] = [];
  const unlocatedParcels: DeliveryParcel[] = [];

  // 1. Separate located vs missing coordinates
  parcels.forEach(p => {
    const coords = getOrResolveCoordinates(p);
    if (coords) {
      // Ensure parcel has coords assigned
      const updatedParcel = { ...p, latitude: coords.lat, longitude: coords.lng };
      locatedParcels.push({ parcel: updatedParcel, lat: coords.lat, lng: coords.lng });
    } else {
      unlocatedParcels.push(p);
    }
  });

  // 2. Nearest-Neighbor TSP Algorithm
  const stops: RouteStop[] = [];
  const unvisited = [...locatedParcels];
  let currentLat = startPoint.lat;
  let currentLng = startPoint.lng;
  let accumulatedMinutes = 0; // Starts from 08:30 AM
  let totalDistance = 0;

  const startHour = 8;
  const startMinute = 30;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const item = unvisited[i];
      const dist = calculateHaversineKm(currentLat, currentLng, item.lat, item.lng);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIndex = i;
      }
    }

    const nextStopItem = unvisited.splice(nearestIndex, 1)[0];
    totalDistance += shortestDist;

    // Travel time: average 22 km/h city speed -> ~2.7 mins per km + 3.5 mins delivery handoff
    const travelTime = Math.max(2, Math.round(shortestDist * 2.7));
    const handoffTime = 4; // 4 mins handoff per parcel
    accumulatedMinutes += travelTime + handoffTime;

    // Calculate formatted ETA
    const etaTotalMinutes = startMinute + accumulatedMinutes;
    const etaHour = startHour + Math.floor(etaTotalMinutes / 60);
    const etaMin = etaTotalMinutes % 60;
    const formattedEta = `${etaHour.toString().padStart(2, '0')}:${etaMin.toString().padStart(2, '0')} ${etaHour >= 12 ? 'PM' : 'AM'}`;

    stops.push({
      stopNumber: stops.length + 1,
      parcel: nextStopItem.parcel,
      distanceFromPrevKm: shortestDist,
      travelTimeMins: travelTime,
      estimatedArrival: formattedEta,
      hasCoordinates: true
    });

    currentLat = nextStopItem.lat;
    currentLng = nextStopItem.lng;
  }

  const completedCount = parcels.filter(p => p.status === 'Completed').length;
  const pendingCount = parcels.filter(p => p.status === 'Pending').length;
  const totalCod = parcels.reduce((sum, p) => sum + (p.codAmount || 0), 0);

  return {
    id: `ROUTE-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    totalStops: stops.length,
    completedStops: completedCount,
    pendingStops: pendingCount,
    totalDistanceKm: Number(totalDistance.toFixed(1)),
    totalEstimatedTimeMinutes: accumulatedMinutes,
    totalCodAmount: totalCod,
    stops,
    unlocatedParcels,
    calculatedAt: new Date().toISOString(),
    startHub: startPoint
  };
}
