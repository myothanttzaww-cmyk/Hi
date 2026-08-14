export type ScreenType =
  | 'splash'
  | 'login'
  | 'home'
  | 'settings'
  | 'scanner'
  | 'ocr_result'
  | 'customer_list'
  | 'customer_detail'
  | 'customer_edit'
  | 'today_delivery'
  | 'parcel_import'
  | 'map_route'
  | 'ai_assistant';

export interface UserSessionState {
  employeeId: string;
  isRememberMe: boolean;
  isLoggedIn: boolean;
  lastLoginTimestamp?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  normalizedPhone: string;
  address: string;
  township: string;
  latitude: number | null;
  longitude: number | null;
  note: string;
  deliveryCount: number;
  lastDeliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  isUnknown?: boolean;
}

export type DeliveryStatus = 'Pending' | 'Completed' | 'Skipped';

export interface DeliveryParcel {
  id: string;
  trackingNo: string;
  customerId: string;
  customerName: string;
  phone?: string;
  normalizedPhone: string;
  address: string;
  township: string;
  latitude: number | null;
  longitude: number | null;
  status: DeliveryStatus;
  codAmount: number;
  note?: string;
  scannedAt: string;
  deliveredAt?: string;
  source: 'camera_ocr' | 'import_csv' | 'import_json' | 'manual';
}

export interface ImportSummary {
  totalRows: number;
  importedCount: number;
  matchedCustomerCount: number;
  unknownCustomerCount: number;
  skippedCount: number;
  errors: { row: number; reason: string; raw: string }[];
  timestamp: string;
}

export interface PhoneNumberCandidate {
  rawNumber: string;
  normalizedNumber: string;
  matchedLabel?: string;
  confidence: number;
  isPriority: boolean;
  lineIndex: number;
  isHandwritten?: boolean;
}

export interface OcrResult {
  primaryPhoneNumber: string;
  normalizedPhoneNumber: string;
  confidence: number;
  fullRawText: string;
  candidates: PhoneNumberCandidate[];
  matchedLabel?: string;
  scanTimestamp: number;
  parcelTrackingNumber?: string;
  receiverName?: string;
  deliveryAddress?: string;
  geminiVerified?: boolean;
  geminiConfidence?: number;
  geminiReasoning?: string;
  isHandwrittenDetected?: boolean;
  preprocessingApplied?: {
    grayscale: boolean;
    contrast: number;
    sharpen: boolean;
    binarize: boolean;
  };
}

export interface SampleParcel {
  id: string;
  trackingNo: string;
  recipientName: string;
  phoneRaw: string;
  address: string;
  senderName: string;
  senderPhone: string;
  waybillFullText: string;
  tag: string;
  isHandwritten?: boolean;
  handwritingType?: 'Myanmar Script' | 'Messy Ballpoint' | 'Cursive Stylized' | 'Thermal Print';
}

export interface RouteStop {
  stopNumber: number;
  parcel: DeliveryParcel;
  distanceFromPrevKm: number;
  travelTimeMins: number;
  estimatedArrival: string;
  hasCoordinates: boolean;
}

export interface RoutePlan {
  id: string;
  date: string;
  totalStops: number;
  completedStops: number;
  pendingStops: number;
  totalDistanceKm: number;
  totalEstimatedTimeMinutes: number;
  totalCodAmount: number;
  stops: RouteStop[];
  unlocatedParcels: DeliveryParcel[];
  calculatedAt: string;
  startHub: {
    name: string;
    lat: number;
    lng: number;
  };
}

export interface AIAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: 'summary' | 'next_stop' | 'cod' | 'search' | 'optimize' | 'missing_phone' | 'general';
  actionLink?: {
    screen: ScreenType;
    label: string;
  };
  metrics?: {
    remaining?: number;
    codAmount?: number;
    nextStopName?: string;
    nextStopPhone?: string;
  };
}

export interface ImagePreprocessOptions {
  grayscale: boolean;
  contrastBoost: number; // 1.0 - 2.5
  sharpen: boolean;
  binarizeThreshold: number; // 0 - 255, 0 = off
  invert: boolean;
}

export interface FolderNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  description: string;
  children?: FolderNode[];
}

export interface CodeFile {
  name: string;
  path: string;
  category: 'config' | 'di' | 'data' | 'domain' | 'permission' | 'camera' | 'ui' | 'screen' | 'route' | 'ai';
  description: string;
  code: string;
}
