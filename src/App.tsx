import { useState, useEffect } from 'react';
import { ScreenType, UserSessionState, OcrResult, Customer, DeliveryParcel, DeliveryStatus, ImportSummary } from './types';
import { CustomerStorage } from './data/customerStore';
import { PhoneFrame } from './components/PhoneFrame';
import { SplashView } from './components/SplashView';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { SettingsView } from './components/SettingsView';
import { ScannerView } from './components/ScannerView';
import { OcrResultView } from './components/OcrResultView';
import { CustomerListView } from './components/CustomerListView';
import { CustomerDetailView } from './components/CustomerDetailView';
import { CustomerEditModal } from './components/CustomerEditModal';
import { TodayDeliveryView } from './components/TodayDeliveryView';
import { ParcelImportView } from './components/ParcelImportView';
import { MapRouteView } from './components/MapRouteView';
import { AIAssistantView } from './components/AIAssistantView';
import { ArchitectureViewer } from './components/ArchitectureViewer';

const SESSION_STORAGE_KEY = 'rexgo_user_session_v1';
const SCAN_COUNT_KEY = 'rexgo_scan_count_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [isFramed, setIsFramed] = useState(true);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [currentOcrResult, setCurrentOcrResult] = useState<OcrResult | null>(null);

  // Customer & Delivery State from CustomerStorage (Room DB Simulation)
  const [customers, setCustomers] = useState<Customer[]>(() => CustomerStorage.getCustomers());
  const [deliveries, setDeliveries] = useState<DeliveryParcel[]>(() => CustomerStorage.getDeliveries());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modal State for Customer Editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [initialModalPhone, setInitialModalPhone] = useState('');
  const [initialModalName, setInitialModalName] = useState('');
  const [initialModalAddress, setInitialModalAddress] = useState('');

  // Scan Counter
  const [scanCount, setScanCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SCAN_COUNT_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Local Session State (Replicating Jetpack DataStore)
  const [session, setSession] = useState<UserSessionState>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      employeeId: '',
      isRememberMe: false,
      isLoggedIn: false
    };
  });

  // Refresh customer & delivery lists
  const reloadData = () => {
    setCustomers(CustomerStorage.getCustomers());
    setDeliveries(CustomerStorage.getDeliveries());
  };

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save session changes to localStorage
  const saveSession = (newSession: UserSessionState) => {
    setSession(newSession);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // ignore
    }
  };

  const handleLoginSuccess = (employeeId: string, rememberMe: boolean) => {
    const newSession: UserSessionState = {
      employeeId: rememberMe ? employeeId : '',
      isRememberMe: rememberMe,
      isLoggedIn: true,
      lastLoginTimestamp: new Date().toISOString()
    };
    saveSession(newSession);
    reloadData();
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    const newSession: UserSessionState = {
      employeeId: session.isRememberMe ? session.employeeId : '',
      isRememberMe: session.isRememberMe,
      isLoggedIn: false
    };
    saveSession(newSession);
    setCurrentScreen('login');
  };

  const handleScanComplete = (result: OcrResult) => {
    setCurrentOcrResult(result);
    const newCount = scanCount + 1;
    setScanCount(newCount);
    try {
      localStorage.setItem(SCAN_COUNT_KEY, newCount.toString());
    } catch {
      // ignore
    }
    setCurrentScreen('ocr_result');
  };

  // Handle continue from OCR result screen
  const handleOcrContinue = (finalPhone: string) => {
    const matchRes = CustomerStorage.addOrMatchDelivery({
      phone: finalPhone,
      customerName: currentOcrResult?.receiverName,
      address: currentOcrResult?.deliveryAddress,
      trackingNo: currentOcrResult?.parcelTrackingNumber,
      note: 'Scanned via CameraX OCR'
    });

    reloadData();

    if (!matchRes.isNewCustomer) {
      // Customer exists in DB -> open Customer Detail screen
      setSelectedCustomer(matchRes.customer);
      setCurrentScreen('customer_detail');
    } else {
      // Unknown customer -> open Edit Modal to easily name and confirm customer details
      setCustomerToEdit(null);
      setInitialModalPhone(finalPhone);
      setInitialModalName(currentOcrResult?.receiverName || '');
      setInitialModalAddress(currentOcrResult?.deliveryAddress || '');
      setIsEditModalOpen(true);
      setCurrentScreen('today_delivery');
    }
  };

  // Customer Management Handlers
  const handleOpenAddCustomer = () => {
    setCustomerToEdit(null);
    setInitialModalPhone('');
    setInitialModalName('');
    setInitialModalAddress('');
    setIsEditModalOpen(true);
  };

  const handleOpenEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsEditModalOpen(true);
  };

  const handleSaveCustomerSuccess = (savedCustomer: Customer) => {
    reloadData();
    setIsEditModalOpen(false);
    setSelectedCustomer(savedCustomer);
    if (currentScreen === 'customer_list' || currentScreen === 'customer_detail') {
      setCurrentScreen('customer_detail');
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    CustomerStorage.deleteCustomer(customerId);
    reloadData();
    setSelectedCustomer(null);
    setCurrentScreen('customer_list');
  };

  const handleAddToTodayDelivery = (customer: Customer) => {
    CustomerStorage.addOrMatchDelivery({
      phone: customer.phone || customer.normalizedPhone,
      customerName: customer.name,
      address: customer.address,
      township: customer.township,
      note: customer.note
    });
    reloadData();
    setCurrentScreen('today_delivery');
  };

  const handleUpdateDeliveryStatus = (deliveryId: string, status: DeliveryStatus) => {
    CustomerStorage.updateDeliveryStatus(deliveryId, status);
    reloadData();
  };

  const handleImportComplete = (summary: ImportSummary) => {
    reloadData();
  };

  return (
    <div className="w-full min-h-screen bg-[#08090C] text-slate-100 font-sans">
      <PhoneFrame
        currentTime={currentTime}
        isFramed={isFramed}
        onToggleFrame={() => setIsFramed(!isFramed)}
        onOpenArchitecture={() => setIsArchOpen(true)}
      >
        {currentScreen === 'splash' && (
          <SplashView onComplete={() => setCurrentScreen('login')} />
        )}

        {currentScreen === 'login' && (
          <LoginView
            session={session}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentScreen === 'home' && (
          <HomeView
            session={session}
            scanCount={scanCount}
            customers={customers}
            deliveries={deliveries}
            onNavigateToSettings={() => setCurrentScreen('settings')}
            onNavigateToScanner={() => setCurrentScreen('scanner')}
            onNavigateToCustomers={() => setCurrentScreen('customer_list')}
            onNavigateToTodayDelivery={() => setCurrentScreen('today_delivery')}
            onNavigateToImport={() => setCurrentScreen('parcel_import')}
            onNavigateToMapRoute={() => setCurrentScreen('map_route')}
            onNavigateToAIAssistant={() => setCurrentScreen('ai_assistant')}
          />
        )}

        {currentScreen === 'scanner' && (
          <ScannerView
            onNavigateBack={() => setCurrentScreen('home')}
            onScanComplete={handleScanComplete}
          />
        )}

        {currentScreen === 'ocr_result' && currentOcrResult && (
          <OcrResultView
            ocrResult={currentOcrResult}
            onRescan={() => setCurrentScreen('scanner')}
            onContinue={handleOcrContinue}
          />
        )}

        {currentScreen === 'customer_list' && (
          <CustomerListView
            customers={customers}
            onSelectCustomer={(c) => {
              setSelectedCustomer(c);
              setCurrentScreen('customer_detail');
            }}
            onAddNewCustomer={handleOpenAddCustomer}
            onNavigateBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'customer_detail' && selectedCustomer && (
          <CustomerDetailView
            customer={selectedCustomer}
            onNavigateBack={() => setCurrentScreen('customer_list')}
            onEditCustomer={handleOpenEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onAddToTodayDelivery={handleAddToTodayDelivery}
          />
        )}

        {currentScreen === 'today_delivery' && (
          <TodayDeliveryView
            deliveries={deliveries}
            onNavigateBack={() => setCurrentScreen('home')}
            onNavigateToScanner={() => setCurrentScreen('scanner')}
            onNavigateToImport={() => setCurrentScreen('parcel_import')}
            onNavigateToMapRoute={() => setCurrentScreen('map_route')}
            onNavigateToAIAssistant={() => setCurrentScreen('ai_assistant')}
            onUpdateStatus={handleUpdateDeliveryStatus}
          />
        )}

        {currentScreen === 'map_route' && (
          <MapRouteView
            deliveries={deliveries}
            onNavigateBack={() => setCurrentScreen('home')}
            onUpdateStatus={handleUpdateDeliveryStatus}
          />
        )}

        {currentScreen === 'ai_assistant' && (
          <AIAssistantView
            deliveries={deliveries}
            customers={customers}
            onNavigateBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'parcel_import' && (
          <ParcelImportView
            onNavigateBack={() => setCurrentScreen('today_delivery')}
            onImportComplete={handleImportComplete}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsView
            onNavigateBack={() => setCurrentScreen('home')}
            onLogout={handleLogout}
          />
        )}
      </PhoneFrame>

      {/* Customer Edit / Add Modal */}
      <CustomerEditModal
        isOpen={isEditModalOpen}
        customerToEdit={customerToEdit}
        initialPhone={initialModalPhone}
        initialName={initialModalName}
        initialAddress={initialModalAddress}
        onClose={() => setIsEditModalOpen(false)}
        onSaveSuccess={handleSaveCustomerSuccess}
        onOpenExistingDuplicate={(existing) => {
          setSelectedCustomer(existing);
          setCurrentScreen('customer_detail');
        }}
      />

      {/* Full Android Architecture & Source Code Viewer */}
      <ArchitectureViewer
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />
    </div>
  );
}


