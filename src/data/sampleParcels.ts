import { SampleParcel } from '../types';

export const SAMPLE_PARCELS: SampleParcel[] = [
  {
    id: 'parcel-1',
    trackingNo: 'RG-994821-MM',
    recipientName: 'ဦးမင်းမင်းထွန်း (U Min Min Htun)',
    phoneRaw: 'O9-450-O12-345',
    address: 'အမှတ် (၄၅)၊ ကုန်သည်လမ်း၊ ကျောက်တံတားမြို့နယ်၊ ရန်ကုန်။',
    senderName: 'Apex Shop Yangon',
    senderPhone: '09-250-998-112',
    tag: 'Printed Yangon Express',
    isHandwritten: false,
    handwritingType: 'Thermal Print',
    waybillFullText: `REXGO LOGISTICS CO., LTD
TRACKING: RG-994821-MM
================================
SENDER: APEX SHOP (09-250-998-112)
TO: ဦးမင်းမင်းထွန်း (U Min Min Htun)
PHONE: O9-450-O12-345
ADDRESS: အမှတ် (၄၅)၊ ကုန်သည်လမ်း၊
ကျောက်တံတားမြို့နယ်၊ ရန်ကုန်တိုင်း။
COD AMOUNT: 35,000 MMK
WEIGHT: 1.2 KG
DELIVERY TYPE: STANDARD NEXT DAY`
  },
  {
    id: 'parcel-2',
    trackingNo: 'RG-552109-MDY',
    recipientName: 'ဒေါ်သန္တာအေး (Daw Thandar Aye)',
    phoneRaw: '၀၉-၇၇၁၂၃၄၅၆၇',
    address: 'အကွက် (၃၄)၊ ၇၃ လမ်းနှင့် ၃၀ လမ်းထောင့်၊ ချမ်းအေးသာစံမြို့နယ်၊ မန္တလေး။',
    senderName: 'Mandalay Cosmetics',
    senderPhone: '၀၉-၂၆၁၂၃၄၅၆၇',
    tag: 'Handwritten Myanmar Script (မြန်မာဂဏန်းလက်ရေး)',
    isHandwritten: true,
    handwritingType: 'Myanmar Script',
    waybillFullText: `[Handwritten Waybill / မြန်မာလက်ရေး]
REXGO EXPRESS PARCEL: RG-552109-MDY
================================
ပေးပို့သူ: မန္တလေး အလှကုန်ဆိုင်
လက်ခံသူ: ဒေါ်သန္တာအေး (Daw Thandar Aye)
ဆက်သွယ်ရန် ဖုန်း: ၀၉-၇၇၁၂၃၄၅၆၇
လိပ်စာ: အကွက် (၃၄)၊ ၇၃ လမ်းနှင့် ၃၀ လမ်းထောင့်၊
ချမ်းအေးသာစံမြို့နယ်၊ မန္တလေးမြို့။
ငွေကောက်ခံရန် (COD): ၂၄,၅၀၀ ကျပ်
မှတ်ချက်: ကုန်ပစ္စည်းမဖွင့်မီ ဖုန်းကြိုဆက်ပေးပါ`
  },
  {
    id: 'parcel-3',
    trackingNo: 'RG-883920-YGN',
    recipientName: 'ကိုအောင်ကျော်ဇော (Ko Aung Kyaw Zaw)',
    phoneRaw: '0 9 9 6 5 4 3 2 1 0 9',
    address: 'အခန်း (၃၀၂)၊ တိုက် (၁၂)၊ သမိုင်းဘူတာရုံလမ်း၊ မရမ်းကုန်းမြို့နယ်၊ ရန်ကုန်။',
    senderName: 'Ballpoint Courier Shop',
    senderPhone: '09-400-555-666',
    tag: 'Messy Ballpoint Pen (ဘောပင်လက်ရေးကြမ်း)',
    isHandwritten: true,
    handwritingType: 'Messy Ballpoint',
    waybillFullText: `[Handwritten / ဘောပင်ဖြင့် ရေးထားသော ပါဆယ်]
TRACKING ID: RG-883920-YGN
--------------------------------
To: Ko Aung Kyaw Zaw
Ph: 0 9 9 6 5 4 3 2 1 0 9 (လက်ခံသူ ဖုန်း)
Room 302, Bldg 12, Thamaing Station Rd, Mayangone.
Prepaid: YES (Fragile Handle with Care)`
  },
  {
    id: 'parcel-4',
    trackingNo: 'RG-772834-YGN',
    recipientName: 'ဒေါ်နီလာစိုး (Daw Nilar Soe)',
    phoneRaw: '+959-250-114-477',
    address: 'အမှတ် (၅၆)၊ အနော်ရထာလမ်း၊ ပန်းဘဲတန်းမြို့နယ်၊ ရန်ကုန်။',
    senderName: 'TechHub Gadgets',
    senderPhone: '09-400-555-666',
    tag: 'International +959 Format',
    isHandwritten: false,
    handwritingType: 'Thermal Print',
    waybillFullText: `REXGO EXPRESS AIR COURIER
PARCEL ID: RG-772834-YGN
================================
RECIPIENT: Daw Nilar Soe (ဒေါ်နီလာစိုး)
CONTACT TEL: +959-250-114-477
DELIVERY ADDR: No 56, Anawrahta Road,
Pabedan Township, Yangon.
COD: 15,000 MMK`
  },
  {
    id: 'parcel-5',
    trackingNo: 'RG-112093-BGO',
    recipientName: 'မနှင်းနုဝေ (Ma Hnin Nu Wai)',
    phoneRaw: 'O9-798-765-432',
    address: 'အမှတ် (၁၂)၊ ဇောတိကလမ်း၊ ဥဿာမြို့သစ်၊ ပဲခူးမြို့။',
    senderName: 'Fashion Queen Closet',
    senderPhone: '09-440-112-233',
    tag: 'Cursive Stylized Marker (ဖောင်တိန်လက်ရေးစောင်း)',
    isHandwritten: true,
    handwritingType: 'Cursive Stylized',
    waybillFullText: `[Handwritten Marker Waybill]
WAYBILL: RG-112093-BGO
--------------------------------
SHIPPER: Fashion Queen Closet
RECEIVER: Ma Hnin Nu Wai (မနှင်းနုဝေ)
Mobile / Ph: O9-798-765-432
DESTINATION: No. 12, Zawtika St, Bago.
TOTAL COD: 18,000 KS`
  }
];

