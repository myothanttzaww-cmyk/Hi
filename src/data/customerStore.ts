import { Customer, DeliveryParcel, ImportSummary } from '../types';
import { cleanPhoneNumber, isValidMyanmarPhone } from '../utils/ocrEngine';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'ဦးမင်းမင်းထွန်း (U Min Min Htun)',
    phone: '09450012345',
    normalizedPhone: '09450012345',
    address: 'အမှတ် (၄၅)၊ ကုန်သည်လမ်း',
    township: 'ကျောက်တံတား (Kyauktada)',
    latitude: 16.7745,
    longitude: 96.1601,
    note: 'ရုံးခန်း ၃ လွှာသို့ ပို့ပေးပါ။ နေ့လယ် ၁ နာရီနောက်ပိုင်း ဖုန်းကြိုဆက်ပါ။',
    deliveryCount: 8,
    lastDeliveredAt: '2026-08-12T14:30:00Z',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 'CUST-002',
    name: 'ဒေါ်သန္တာအေး (Daw Thandar Aye)',
    phone: '09771234567',
    normalizedPhone: '09771234567',
    address: 'အကွက် (၃၄)၊ ၇၃ လမ်းနှင့် ၃၀ လမ်းထောင့်',
    township: 'ချမ်းအေးသာစံ (Chanayethazan)',
    latitude: 21.9750,
    longitude: 96.0833,
    note: 'အိမ်နံပါတ် အဝါရောင်တိုက်၊ ခြံတံခါး ဘဲလ်တီးပါ။',
    deliveryCount: 12,
    lastDeliveredAt: '2026-08-13T11:15:00Z',
    createdAt: '2026-02-14T09:30:00Z',
    updatedAt: '2026-08-13T11:15:00Z'
  },
  {
    id: 'CUST-003',
    name: 'ကိုအောင်ကျော်ဇော (Ko Aung Kyaw Zaw)',
    phone: '09965432109',
    normalizedPhone: '09965432109',
    address: 'အခန်း (၃၀၂)၊ တိုက် (၁၂)၊ သမိုင်းဘူတာရုံလမ်း',
    township: 'မရမ်းကုန်း (Mayangone)',
    latitude: 16.8580,
    longitude: 96.1360,
    note: 'ဓာတ်လှေကား ပျက်နေပါက အောက်ထပ် လုံခြုံရေးထံ အပ်ပေးပါ။',
    deliveryCount: 5,
    lastDeliveredAt: '2026-08-10T16:45:00Z',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-08-10T16:45:00Z'
  },
  {
    id: 'CUST-004',
    name: 'မနှင်းနုဝေ (Ma Hnin Nu Wai)',
    phone: '09798765432',
    normalizedPhone: '09798765432',
    address: 'အမှတ် (၁၂)၊ ဇောတိကလမ်း၊ ဥဿာမြို့သစ်',
    township: 'ပဲခူး (Bago)',
    latitude: 17.3221,
    longitude: 96.4813,
    note: 'အဝတ်အထည်ပါဆယ်ဖြစ်သဖြင့် ရေမစိုပါစေနှင့်။',
    deliveryCount: 3,
    lastDeliveredAt: '2026-08-08T09:20:00Z',
    createdAt: '2026-04-05T12:00:00Z',
    updatedAt: '2026-08-08T09:20:00Z'
  },
  {
    id: 'CUST-005',
    name: 'ကိုဇေယျာလင်း (Ko Zayar Lin)',
    phone: '',
    normalizedPhone: '',
    address: 'အခန်း (၁၀၁)၊ လှည်းတန်းလမ်းမကြီး၊ စံရိပ်ငြိမ် ၆ လမ်း',
    township: 'ကမာရွတ် (Kamayut)',
    latitude: 16.8290,
    longitude: 96.1280,
    note: 'ဖုန်းလိုင်းမမိတတ်သောကြောင့် လိပ်စာအတိုင်း တိုက်ရိုက်လာရောက်ပေးပို့ပါ။ (Phone မရှိသော Customer)',
    deliveryCount: 2,
    lastDeliveredAt: '2026-08-05T15:10:00Z',
    createdAt: '2026-05-12T14:00:00Z',
    updatedAt: '2026-08-05T15:10:00Z'
  },
  {
    id: 'CUST-006',
    name: 'ဒေါ်နီလာစိုး (Daw Nilar Soe)',
    phone: '09250114477',
    normalizedPhone: '09250114477',
    address: 'အမှတ် (၅၆)၊ အနော်ရထာလမ်း၊ ပန်းဘဲတန်းမြို့နယ်',
    township: 'ပန်းဘဲတန်း (Pabedan)',
    latitude: 16.7760,
    longitude: 96.1550,
    note: 'ငွေသား အတိအကျ ပေးပါမည်။ အကြွေအမ်းရန် မလိုပါ။',
    deliveryCount: 9,
    lastDeliveredAt: '2026-08-11T13:40:00Z',
    createdAt: '2026-01-25T11:00:00Z',
    updatedAt: '2026-08-11T13:40:00Z'
  },
  {
    id: 'CUST-007',
    name: 'ကိုဖြိုးဝေအောင် (Ko Phyo Wai Aung)',
    phone: '09420889933',
    normalizedPhone: '09420889933',
    address: 'အမှတ် (၈၈)၊ ရာဇာဓိရာဇ်လမ်း၊ တောင်ဥက္ကလာပမြို့နယ်',
    township: 'တောင်ဥက္ကလာပ (South Okkalapa)',
    latitude: 16.8520,
    longitude: 96.1780,
    note: 'ညနေ ၅ နာရီနောက်ပိုင်းသာ အိမ်တွင် လူရှိပါမည်။',
    deliveryCount: 6,
    lastDeliveredAt: '2026-08-09T17:30:00Z',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-08-09T17:30:00Z'
  },
  {
    id: 'CUST-008',
    name: 'မရွှေရည်ဝင်း (Ma Shwe Yee Win)',
    phone: '09780556677',
    normalizedPhone: '09780556677',
    address: 'တိုက် (၄)၊ အခန်း (၂၀)၊ ပြည်ထောင်စုရိပ်သာ၊ ဒဂုံမြို့နယ်',
    township: 'ဒဂုံ (Dagon)',
    latitude: 16.7910,
    longitude: 96.1480,
    note: 'လုံခြုံရေးဂိတ်တွင် RexGo Courier ဟု ပြော၍ ဝင်ပါ။',
    deliveryCount: 15,
    lastDeliveredAt: '2026-08-13T10:00:00Z',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-08-13T10:00:00Z'
  }
];

export const INITIAL_TODAY_DELIVERIES: DeliveryParcel[] = [
  {
    id: 'DEL-101',
    trackingNo: 'RG-994821-MM',
    customerId: 'CUST-001',
    customerName: 'ဦးမင်းမင်းထွန်း (U Min Min Htun)',
    phone: '09450012345',
    normalizedPhone: '09450012345',
    address: 'အမှတ် (၄၅)၊ ကုန်သည်လမ်း',
    township: 'ကျောက်တံတား (Kyauktada)',
    latitude: 16.7745,
    longitude: 96.1601,
    status: 'Pending',
    codAmount: 35000,
    note: 'ရုံးခန်း ၃ လွှာသို့ ပို့ပေးပါ။',
    scannedAt: '2026-08-14T08:30:00Z',
    source: 'camera_ocr'
  },
  {
    id: 'DEL-102',
    trackingNo: 'RG-552109-MDY',
    customerId: 'CUST-002',
    customerName: 'ဒေါ်သန္တာအေး (Daw Thandar Aye)',
    phone: '09771234567',
    normalizedPhone: '09771234567',
    address: 'အကွက် (၃၄)၊ ၇၃ လမ်းနှင့် ၃၀ လမ်းထောင့်',
    township: 'ချမ်းအေးသာစံ (Chanayethazan)',
    latitude: 21.9750,
    longitude: 96.0833,
    status: 'Pending',
    codAmount: 24500,
    note: 'ကုန်ပစ္စည်းမဖွင့်မီ ဖုန်းကြိုဆက်ပေးပါ',
    scannedAt: '2026-08-14T08:45:00Z',
    source: 'camera_ocr'
  },
  {
    id: 'DEL-103',
    trackingNo: 'RG-772834-YGN',
    customerId: 'CUST-003',
    customerName: 'ကိုအောင်ကျော်ဇော (Ko Aung Kyaw Zaw)',
    phone: '09965432109',
    normalizedPhone: '09965432109',
    address: 'အခန်း (၃၀၂)၊ တိုက် (၁၂)၊ သမိုင်းဘူတာရုံလမ်း',
    township: 'မရမ်းကုန်း (Mayangone)',
    latitude: 16.8580,
    longitude: 96.1360,
    status: 'Completed',
    codAmount: 0,
    note: 'Prepaid parcel (Handled with care)',
    scannedAt: '2026-08-14T09:00:00Z',
    deliveredAt: '2026-08-14T09:40:00Z',
    source: 'camera_ocr'
  },
  {
    id: 'DEL-104',
    trackingNo: 'RG-112093-BGO',
    customerId: 'CUST-004',
    customerName: 'မနှင်းနုဝေ (Ma Hnin Nu Wai)',
    phone: '09798765432',
    normalizedPhone: '09798765432',
    address: 'အမှတ် (၁၂)၊ ဇောတိကလမ်း၊ ဥဿာမြို့သစ်',
    township: 'ပဲခူး (Bago)',
    latitude: 17.3221,
    longitude: 96.4813,
    status: 'Pending',
    codAmount: 18000,
    note: 'အဝတ်အထည်ပါဆယ်',
    scannedAt: '2026-08-14T09:15:00Z',
    source: 'camera_ocr'
  }
];

const CUSTOMERS_KEY = 'rexgo_customers_v3';
const DELIVERIES_KEY = 'rexgo_today_deliveries_v3';

export const CustomerStorage = {
  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(CUSTOMERS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    this.saveCustomers(INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  },

  saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers to storage', e);
    }
  },

  getDeliveries(): DeliveryParcel[] {
    try {
      const data = localStorage.getItem(DELIVERIES_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    this.saveDeliveries(INITIAL_TODAY_DELIVERIES);
    return INITIAL_TODAY_DELIVERIES;
  },

  saveDeliveries(deliveries: DeliveryParcel[]): void {
    try {
      localStorage.setItem(DELIVERIES_KEY, JSON.stringify(deliveries));
    } catch (e) {
      console.error('Failed to save deliveries to storage', e);
    }
  },

  findCustomerByPhone(phone: string): Customer | undefined {
    const cleaned = cleanPhoneNumber(phone);
    if (!cleaned) return undefined;
    const customers = this.getCustomers();
    return customers.find(c => c.normalizedPhone && c.normalizedPhone === cleaned);
  },

  addCustomer(newCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'deliveryCount' | 'lastDeliveredAt'>): { success: boolean; customer: Customer; isDuplicate?: boolean } {
    const customers = this.getCustomers();
    const cleaned = newCustomer.phone ? cleanPhoneNumber(newCustomer.phone) : '';

    // Check duplicate if phone is provided
    if (cleaned) {
      const existing = customers.find(c => c.normalizedPhone === cleaned);
      if (existing) {
        return { success: false, customer: existing, isDuplicate: true };
      }
    }

    const id = `CUST-${Date.now().toString().slice(-6)}`;
    const created: Customer = {
      ...newCustomer,
      id,
      phone: newCustomer.phone || '',
      normalizedPhone: cleaned,
      deliveryCount: 0,
      lastDeliveredAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedList = [created, ...customers];
    this.saveCustomers(updatedList);
    return { success: true, customer: created };
  },

  updateCustomer(id: string, updates: Partial<Customer>): { success: boolean; customer?: Customer; error?: string } {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return { success: false, error: 'Customer not found' };

    if (updates.phone !== undefined) {
      const cleaned = cleanPhoneNumber(updates.phone);
      if (cleaned) {
        const duplicate = customers.find(c => c.id !== id && c.normalizedPhone === cleaned);
        if (duplicate) {
          return { success: false, error: 'ဒီ Phone နံပါတ်ဖြင့် အခြား Customer ရှိပြီးဖြစ်ပါသည်' };
        }
        updates.normalizedPhone = cleaned;
      } else {
        updates.normalizedPhone = '';
      }
    }

    const updatedCustomer: Customer = {
      ...customers[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    customers[index] = updatedCustomer;
    this.saveCustomers(customers);

    // Also update any today's deliveries referencing this customer
    const deliveries = this.getDeliveries();
    let hasDeliveryChanges = false;
    const updatedDeliveries = deliveries.map(d => {
      if (d.customerId === id) {
        hasDeliveryChanges = true;
        return {
          ...d,
          customerName: updatedCustomer.name,
          phone: updatedCustomer.phone,
          normalizedPhone: updatedCustomer.normalizedPhone,
          address: updatedCustomer.address,
          township: updatedCustomer.township,
          latitude: updatedCustomer.latitude,
          longitude: updatedCustomer.longitude
        };
      }
      return d;
    });
    if (hasDeliveryChanges) {
      this.saveDeliveries(updatedDeliveries);
    }

    return { success: true, customer: updatedCustomer };
  },

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers().filter(c => c.id !== id);
    this.saveCustomers(customers);
    return true;
  },

  addOrMatchDelivery(parcelInfo: {
    trackingNo?: string;
    phone?: string;
    customerName?: string;
    address?: string;
    township?: string;
    codAmount?: number;
    note?: string;
    source?: 'camera_ocr' | 'import_csv' | 'import_json' | 'manual';
  }): { delivery: DeliveryParcel; customer: Customer; isNewCustomer: boolean } {
    const cleaned = parcelInfo.phone ? cleanPhoneNumber(parcelInfo.phone) : '';
    let customer = cleaned ? this.findCustomerByPhone(cleaned) : undefined;
    let isNewCustomer = false;

    if (!customer) {
      // Create an unknown / new customer record
      isNewCustomer = true;
      const res = this.addCustomer({
        name: parcelInfo.customerName || (cleaned ? `Unknown (${cleaned})` : 'Unknown Customer'),
        phone: parcelInfo.phone || '',
        normalizedPhone: cleaned,
        address: parcelInfo.address || 'Address pending verification',
        township: parcelInfo.township || 'Yangon',
        latitude: 16.8409,
        longitude: 96.1735,
        note: parcelInfo.note || 'Scanned via RexGo OCR / Auto-created',
        isUnknown: !parcelInfo.customerName
      });
      customer = res.customer;
    }

    const deliveryId = `DEL-${Date.now().toString().slice(-6)}`;
    const tracking = parcelInfo.trackingNo || `RG-${Math.floor(100000 + Math.random() * 900000)}-MM`;

    const newDelivery: DeliveryParcel = {
      id: deliveryId,
      trackingNo: tracking,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      normalizedPhone: customer.normalizedPhone,
      address: customer.address || parcelInfo.address || '',
      township: customer.township || parcelInfo.township || '',
      latitude: customer.latitude,
      longitude: customer.longitude,
      status: 'Pending',
      codAmount: parcelInfo.codAmount || 0,
      note: parcelInfo.note || customer.note,
      scannedAt: new Date().toISOString(),
      source: parcelInfo.source || 'camera_ocr'
    };

    const deliveries = this.getDeliveries();
    this.saveDeliveries([newDelivery, ...deliveries]);

    return { delivery: newDelivery, customer, isNewCustomer };
  },

  updateDeliveryStatus(id: string, status: 'Pending' | 'Completed' | 'Skipped'): void {
    const deliveries = this.getDeliveries();
    const updated = deliveries.map(d => {
      if (d.id === id) {
        const isNowCompleted = status === 'Completed';
        return {
          ...d,
          status,
          deliveredAt: isNowCompleted ? new Date().toISOString() : undefined
        };
      }
      return d;
    });
    this.saveDeliveries(updated);

    // If completed, increment customer deliveryCount
    if (status === 'Completed') {
      const item = deliveries.find(d => d.id === id);
      if (item && item.customerId) {
        const customers = this.getCustomers();
        const cIndex = customers.findIndex(c => c.id === item.customerId);
        if (cIndex !== -1) {
          customers[cIndex] = {
            ...customers[cIndex],
            deliveryCount: customers[cIndex].deliveryCount + 1,
            lastDeliveredAt: new Date().toISOString()
          };
          this.saveCustomers(customers);
        }
      }
    }
  },

  deleteDelivery(id: string): void {
    const deliveries = this.getDeliveries().filter(d => d.id !== id);
    this.saveDeliveries(deliveries);
  },

  // Parse CSV format into parcels
  importParcelsFromCsv(csvText: string): ImportSummary {
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const summary: ImportSummary = {
      totalRows: 0,
      importedCount: 0,
      matchedCustomerCount: 0,
      unknownCustomerCount: 0,
      skippedCount: 0,
      errors: [],
      timestamp: new Date().toISOString()
    };

    if (lines.length === 0) return summary;

    // Detect header
    let startIndex = 0;
    const headerLine = lines[0].toLowerCase();
    let colPhone = 0;
    let colName = 1;
    let colAddr = 2;
    let colTownship = 3;
    let colCod = 4;
    let colNote = 5;

    if (headerLine.includes('phone') || headerLine.includes('ဖုန်း') || headerLine.includes('name') || headerLine.includes('tracking')) {
      startIndex = 1;
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      headers.forEach((h, idx) => {
        if (h.includes('phone') || h.includes('ph') || h.includes('tel') || h.includes('ဖုန်း')) colPhone = idx;
        else if (h.includes('name') || h.includes('recipient') || h.includes('အမည်') || h.includes('လူ')) colName = idx;
        else if (h.includes('address') || h.includes('addr') || h.includes('လိပ်စာ')) colAddr = idx;
        else if (h.includes('township') || h.includes('tsp') || h.includes('မြို့နယ်')) colTownship = idx;
        else if (h.includes('cod') || h.includes('amount') || h.includes('ငွေ')) colCod = idx;
        else if (h.includes('note') || h.includes('remark') || h.includes('မှတ်ချက်')) colNote = idx;
      });
    }

    summary.totalRows = lines.length - startIndex;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      const rawPhone = parts[colPhone] || '';
      const cleaned = cleanPhoneNumber(rawPhone);

      if (!cleaned || !isValidMyanmarPhone(cleaned)) {
        summary.skippedCount++;
        summary.errors.push({
          row: i + 1,
          reason: `Invalid or missing phone number: "${rawPhone}"`,
          raw: line
        });
        continue;
      }

      const name = parts[colName] || '';
      const address = parts[colAddr] || '';
      const township = parts[colTownship] || 'Yangon';
      const cod = parseInt(parts[colCod] || '0', 10) || 0;
      const note = parts[colNote] || '';

      const result = this.addOrMatchDelivery({
        phone: cleaned,
        customerName: name,
        address,
        township,
        codAmount: cod,
        note,
        source: 'import_csv'
      });

      summary.importedCount++;
      if (result.isNewCustomer) {
        summary.unknownCustomerCount++;
      } else {
        summary.matchedCustomerCount++;
      }
    }

    return summary;
  },

  // Parse JSON format into parcels
  importParcelsFromJson(jsonText: string): ImportSummary {
    const summary: ImportSummary = {
      totalRows: 0,
      importedCount: 0,
      matchedCustomerCount: 0,
      unknownCustomerCount: 0,
      skippedCount: 0,
      errors: [],
      timestamp: new Date().toISOString()
    };

    try {
      const parsed = JSON.parse(jsonText);
      const items: any[] = Array.isArray(parsed) ? parsed : parsed.parcels || parsed.items || [parsed];
      summary.totalRows = items.length;

      items.forEach((item, idx) => {
        const rawPhone = item.phone || item.phoneNumber || item.ph || item.telephone || '';
        const cleaned = cleanPhoneNumber(String(rawPhone));

        if (!cleaned || !isValidMyanmarPhone(cleaned)) {
          summary.skippedCount++;
          summary.errors.push({
            row: idx + 1,
            reason: `Invalid or missing phone number: "${rawPhone}"`,
            raw: JSON.stringify(item)
          });
          return;
        }

        const name = item.name || item.customerName || item.recipient || '';
        const address = item.address || item.deliveryAddress || '';
        const township = item.township || item.city || 'Yangon';
        const cod = Number(item.cod || item.codAmount || item.amount || 0) || 0;
        const note = item.note || item.remark || '';
        const tracking = item.trackingNo || item.tracking || undefined;

        const result = this.addOrMatchDelivery({
          trackingNo: tracking,
          phone: cleaned,
          customerName: name,
          address,
          township,
          codAmount: cod,
          note,
          source: 'import_json'
        });

        summary.importedCount++;
        if (result.isNewCustomer) {
          summary.unknownCustomerCount++;
        } else {
          summary.matchedCustomerCount++;
        }
      });
    } catch (e: any) {
      summary.errors.push({
        row: 0,
        reason: `JSON Parse error: ${e.message}`,
        raw: jsonText.slice(0, 100)
      });
    }

    return summary;
  },

  // Export all data to JSON
  exportBackupJson(): string {
    const payload = {
      appName: 'RexGo Hub',
      version: '1.0.0 (Phase 3 Database & Storage)',
      exportedAt: new Date().toISOString(),
      data: {
        customers: this.getCustomers(),
        todayDeliveries: this.getDeliveries()
      }
    };
    return JSON.stringify(payload, null, 2);
  },

  // Import Backup JSON
  restoreBackupJson(jsonString: string): { success: boolean; customerCount: number; deliveryCount: number; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const customers: Customer[] = parsed.data?.customers || parsed.customers || [];
      const deliveries: DeliveryParcel[] = parsed.data?.todayDeliveries || parsed.todayDeliveries || [];

      if (!Array.isArray(customers) && !Array.isArray(deliveries)) {
        return { success: false, customerCount: 0, deliveryCount: 0, message: 'Invalid RexGo Backup Format' };
      }

      if (customers.length > 0) {
        this.saveCustomers(customers);
      }
      if (deliveries.length > 0) {
        this.saveDeliveries(deliveries);
      }

      return {
        success: true,
        customerCount: customers.length,
        deliveryCount: deliveries.length,
        message: 'RexGo Local Database restored successfully'
      };
    } catch (e: any) {
      return {
        success: false,
        customerCount: 0,
        deliveryCount: 0,
        message: `Restore Failed: ${e.message}`
      };
    }
  }
};
