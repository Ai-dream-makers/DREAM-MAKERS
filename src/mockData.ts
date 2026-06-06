import { Elder, HealthStats, GPSCheckpoint, AlertLog, WristbandDevice } from './types';

export const mockElders: Elder[] = [
  {
    id: 'elder-1',
    name: 'ยายสมจิตร์ มีความสุข',
    age: 74,
    gender: 'หญิง',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200', // Mock photo
    chronicDiseases: ['ความดันโลหิตสูง (Hypertension)', 'กระดูกพรุน (Osteoporosis)'],
    allergies: ['ยาเพนิซิลลิน (Penicillin)', 'อาหารทะเล'],
    medications: [
      { name: 'Amlodipine 5mg', dosage: '1 เม็ด', schedule: 'หลังอาหารเช้า' },
      { name: 'Calcium + Vit D', dosage: '1 เม็ด', schedule: 'หลังอาหารเช้า' },
      { name: 'Losartan 50mg', dosage: '1 เม็ด', schedule: 'หลังอาหารเย็น' }
    ],
    bloodType: 'O',
    weight: 54,
    height: 152,
    villageName: 'หมู่บ้านแสนสุข (หมู่ 3)',
    primaryCaregiverName: 'คุณสมชาย มีความสุข (บุตรชาย)',
    emergencyContacts: [
      { name: 'คุณสมชาย มีความสุข', relationship: 'บุตรชาย (ผู้ดูแลหลัก)', phone: '081-234-5678', isPrimary: true },
      { name: 'คุณสายใจ แก้วดี', relationship: 'อสม. ประจำบ้าน', phone: '089-876-5432', isPrimary: false },
      { name: 'ศูนย์กู้ชีพ รพ.สต. ตำบลบ้านแสนสุข', relationship: 'หน่วยกู้ชีพท้องถิ่น', phone: '1669', isPrimary: false }
    ]
  },
  {
    id: 'elder-2',
    name: 'ตาประพันธ์ ดีประเสริฐ',
    age: 81,
    gender: 'ชาย',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    chronicDiseases: ['เบาหวานชนิดที่ 2 (Type 2 Diabetes)', 'โรคหัวใจ исшемическая (Heart Ischemia)'],
    allergies: ['ยางมะตอย (กรดซาลิไซลิก)'],
    medications: [
      { name: 'Metformin 500mg', dosage: '1 เม็ด', schedule: 'หลังอาหารเช้า-เย็น' },
      { name: 'Aspirin protect 100mg', dosage: '1 เม็ด', schedule: 'หลังอาหารกลางวัน' },
      { name: 'Atorvastatin 20mg', dosage: '1 เม็ด', schedule: 'ก่อนนอน' }
    ],
    bloodType: 'A',
    weight: 68,
    height: 165,
    villageName: 'หมู่บ้านดอนทราย (หมู่ 5)',
    primaryCaregiverName: 'คุณธวัชชัย ดีประเสริฐ (บุตรชาย)',
    emergencyContacts: [
      { name: 'คุณธวัชชัย ดีประเสริฐ', relationship: 'บุตรชาย', phone: '082-999-4444', isPrimary: true },
      { name: 'คุณอารีย์ รักสวน', relationship: 'อสม. ประจำบ้าน', phone: '085-111-2222', isPrimary: false },
      { name: 'หน่วยกู้ภัยมูลนิธิร่วมใจ', relationship: 'หน่วยกู้ภ้ย', phone: '1111', isPrimary: false }
    ]
  },
  {
    id: 'elder-3',
    name: 'ยายทองคำ คำสว่าง',
    age: 78,
    gender: 'หญิง',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    chronicDiseases: ['สมองเสื่อมระยะเริ่มต้น (Early Alzheimer)', 'ไขมันในเลือดสูง (Dyslipidemia)'],
    allergies: ['ไม่มีประวัติแพ้ยาและอาหาร'],
    medications: [
      { name: 'Donepezil 5mg', dosage: '1 เม็ด', schedule: 'ก่อนนอน' },
      { name: 'Simvastatin 10mg', dosage: '1 เม็ด', schedule: 'ก่อนนอน' }
    ],
    bloodType: 'AB',
    weight: 49,
    height: 148,
    villageName: 'หมู่บ้านแสนสุข (หมู่ 3)',
    primaryCaregiverName: 'คุณสุดา คำสว่าง (หลานสาว)',
    emergencyContacts: [
      { name: 'คุณสุดา คำสว่าง', relationship: 'หลานสาว', phone: '084-555-6677', isPrimary: true },
      { name: 'คุณสายใจ แก้วดี', relationship: 'อสม. ประจำบ้าน', phone: '089-876-5432', isPrimary: false }
    ]
  }
];

export const mockHealthStats: Record<string, HealthStats> = {
  'elder-1': {
    stepsCount: 5420,
    stepsTarget: 6000,
    avgHeartRate: 72,
    maxHeartRate: 114,
    minHeartRate: 61,
    sleepHours: 7.2,
    deepSleepPercent: 28,
    lightSleepPercent: 72,
    weeklySteps: [
      { day: 'จันทร์', count: 4800 },
      { day: 'อังคาร', count: 5200 },
      { day: 'พุธ', count: 6100 },
      { day: 'พฤหัสบดี', count: 4300 },
      { day: 'ศุกร์', count: 5800 },
      { day: 'เสาร์', count: 5420 },
      { day: 'อาทิตย์', count: 0 }
    ],
    hourlyHeartRate: [
      { hour: '08:00', rate: 72 },
      { hour: '10:00', rate: 78 },
      { hour: '12:00', rate: 85 },
      { hour: '14:00', rate: 81 },
      { hour: '16:00', rate: 74 },
      { hour: '18:00', rate: 75 },
      { hour: '20:00', rate: 69 },
      { hour: '22:00', rate: 66 }
    ],
    sleepHistory: [
      { date: '1 มิ.ย.', hours: 6.8 },
      { date: '2 มิ.ย.', hours: 7.2 },
      { date: '3 มิ.ย.', hours: 6.5 },
      { date: '4 มิ.ย.', hours: 7.5 },
      { date: '5 มิ.ย.', hours: 7.2 }
    ]
  },
  'elder-2': {
    stepsCount: 3120,
    stepsTarget: 4000,
    avgHeartRate: 78,
    maxHeartRate: 128,
    minHeartRate: 58,
    sleepHours: 6.1,
    deepSleepPercent: 20,
    lightSleepPercent: 80,
    weeklySteps: [
      { day: 'จันทร์', count: 3200 },
      { day: 'อังคาร', count: 2800 },
      { day: 'พุธ', count: 3500 },
      { day: 'พฤหัสบดี', count: 3900 },
      { day: 'ศุกร์', count: 3120 },
      { day: 'เสาร์', count: 0 },
      { day: 'อาทิตย์', count: 0 }
    ],
    hourlyHeartRate: [
      { hour: '08:00', rate: 75 },
      { hour: '10:00', rate: 82 },
      { hour: '12:00', rate: 91 },
      { hour: '14:00', rate: 84 },
      { hour: '16:00', rate: 78 },
      { hour: '18:00', rate: 80 },
      { hour: '20:00', rate: 74 },
      { hour: '22:00', rate: 70 }
    ],
    sleepHistory: [
      { date: '1 มิ.ย.', hours: 5.5 },
      { date: '2 มิ.ย.', hours: 6.0 },
      { date: '3 มิ.ย.', hours: 6.2 },
      { date: '4 มิ.ย.', hours: 5.8 },
      { date: '5 มิ.ย.', hours: 6.1 }
    ]
  },
  'elder-3': {
    stepsCount: 4230,
    stepsTarget: 5000,
    avgHeartRate: 75,
    maxHeartRate: 112,
    minHeartRate: 64,
    sleepHours: 6.8,
    deepSleepPercent: 25,
    lightSleepPercent: 75,
    weeklySteps: [
      { day: 'จันทร์', count: 4100 },
      { day: 'อังคาร', count: 4300 },
      { day: 'พุธ', count: 3900 },
      { day: 'พฤหัสบดี', count: 4500 },
      { day: 'ศุกร์', count: 4230 },
      { day: 'เสาร์', count: 0 },
      { day: 'อาทิตย์', count: 0 }
    ],
    hourlyHeartRate: [
      { hour: '08:00', rate: 70 },
      { hour: '10:00', rate: 76 },
      { hour: '12:00', rate: 80 },
      { hour: '14:00', rate: 82 },
      { hour: '16:00', rate: 75 },
      { hour: '18:00', rate: 73 },
      { hour: '20:00', rate: 71 },
      { hour: '22:00', rate: 68 }
    ],
    sleepHistory: [
      { date: '1 มิ.ย.', hours: 7.0 },
      { date: '2 มิ.ย.', hours: 6.5 },
      { date: '3 มิ.ย.', hours: 6.8 },
      { date: '4 มิ.ย.', hours: 7.1 },
      { date: '5 มิ.ย.', hours: 6.8 }
    ]
  }
};

export const mockGPSPaths: Record<string, GPSCheckpoint[]> = {
  'elder-1': [
    { time: '07:15', locationName: 'บ้านพักผู้สูงอายุ (ซอยแสนสุข 4)', lat: 13.7563, lng: 100.5018, duration: 'ตื่นนอนและเดินรอบบ้าน' },
    { time: '08:30', locationName: 'ไปตลาดสดหมู่บ้านแสนสุข', lat: 13.7592, lng: 100.5055, duration: 'ซื้ออาหารเช้า (45 นาที)' },
    { time: '10:00', locationName: 'ศาลาประชาคม อุ่นไอรัก', lat: 13.7548, lng: 100.5090, duration: 'ร่วมกิจกรรมผู้สูงอายุ (2 ชั่วโมง)' },
    { time: '12:30', locationName: 'ร้านก๋วยเตี๋ยวป้าเพ็ญ', lat: 13.7570, lng: 100.5041, duration: 'รับประทานอาหารกลางวัน (35 นาที)' },
    { time: '13:30', locationName: 'บ้านพักผู้สูงอายุ (ซอยแสนสุข 4)', lat: 13.7563, lng: 100.5018, duration: 'พักผ่อนในบ้าน (พิกัดปัจจุบัน)' }
  ],
  'elder-2': [
    { time: '06:00', locationName: 'บ้านพัก (ต.ดอนทราย)', lat: 13.7122, lng: 100.4135, duration: 'ตื่นตัว' },
    { time: '07:00', locationName: 'สวนสาธารณะเฉลิมพระเกียรติ', lat: 13.7155, lng: 100.4199, duration: 'เดินออกกำลังกาย (1 ชั่วโมง)' },
    { time: '08:30', locationName: 'สำนักงานสหกรณ์การเกษตร', lat: 13.7099, lng: 100.4111, duration: 'ประชุมเกษตรกรชุมชน (1.5 ชั่วโมง)' },
    { time: '11:00', locationName: 'บ้านพัก (ต.ดอนทราย)', lat: 13.7122, lng: 100.4135, duration: 'พักผ่อนในบ้าน (พิกัดปัจจุบัน)' }
  ],
  'elder-3': [
    { time: '08:00', locationName: 'บ้านพัก (ซอยแสนสุข 2)', lat: 13.7565, lng: 100.4998, duration: 'รับประทานอาหารในบ้าน' },
    { time: '09:15', locationName: 'วัดโพธิ์ร่มเย็น', lat: 13.7621, lng: 100.5015, duration: 'ทำบุญถวายสังฆทาน (1 ชั่วโมง)' },
    { time: '10:45', locationName: 'บ้านพัก (ซอยแสนสุข 2)', lat: 13.7565, lng: 100.4998, duration: 'กลับถึงบ้าน (พิกัดปัจจุบัน)' }
  ]
};

export const mockAlertHistory: AlertLog[] = [
  {
    id: 'alert-101',
    elderId: 'elder-1',
    elderName: 'ยายสมจิตร์ มีความสุข',
    type: 'fall',
    severity: 'critical',
    timestamp: '2026-06-05 14:12',
    details: 'ตรวจพบแรงกระแทกสูง (Fall Sensor triggered 4.2G) ตามด้วยสัญญาณไม่มีการขยับเขยื้อนบริเวณห้องครัว',
    status: 'resolved',
    resolvedBy: 'คุณสมชาย มีความสุข (บุตรชาย)',
    resolvedAt: '2026-06-05 14:20',
    resolutionNote: 'ล้มก้นกระแทกเล็กน้อยเนื่องจากพื้นลื่นในห้องครัว ลูกชายรับทราบและช่วยพยุงลุกขึ้น ไม่มีกระดูกหัก มีเพียงแผลฟกช้ำเล็กน้อย นั่งพักทายาแล้ว'
  },
  {
    id: 'alert-102',
    elderId: 'elder-2',
    elderName: 'ตาประพันธ์ ดีประเสริฐ',
    type: 'high_hr',
    severity: 'alert',
    timestamp: '2026-06-04 10:35',
    details: 'ชีพจรเต้นเร็วเกินเกณฑ์ผิดปกติขณะเดิน (Heart Rate: 132 bpm)',
    status: 'resolved',
    resolvedBy: 'คุณอารีย์ รักสวน (อสม.)',
    resolvedAt: '2026-06-04 11:00',
    resolutionNote: 'อสม. เข้าตรวจสอบพบว่าเกิดจากการเดินเร็วท่ามกลางอากาศร้อนตอนก้าวเดินเข้าตลาด ให้จิบน้ำ นั่งพักในที่ร่ม พัดระบายความร้อน ชีพจรลดลงเป็นปกติที่ 78 bpm'
  },
  {
    id: 'alert-103',
    elderId: 'elder-1',
    elderName: 'ยายสมจิตร์ มีความสุข',
    type: 'low_battery',
    severity: 'warning',
    timestamp: '2026-06-06 05:30',
    details: 'แบตเตอรี่สายรัดข้อมือต่ำกว่า 15% (Battery level: 12%) - กรุณาแจ้งผู้ดูแลเพื่อนำสมาร์ทแบนด์เสียบชาร์จสายไฟ',
    status: 'pending'
  }
];

export const mockDevices: WristbandDevice[] = [
  {
    deviceId: 'CB-X9901',
    elderId: 'elder-1',
    connectionStatus: 'connected',
    batteryLevel: 84,
    isCharging: false,
    signalStrength: 'excellent',
    firmwareVersion: 'v2.4.12',
    lastSyncTime: 'เมื่อ 1 นาทีที่แล้ว',
    sensorCalibration: {
      accelerometer: true,
      gyroscope: true,
      barometer: true,
      opticalHeartRate: true
    }
  },
  {
    deviceId: 'CB-X9902',
    elderId: 'elder-2',
    connectionStatus: 'connected',
    batteryLevel: 62,
    isCharging: false,
    signalStrength: 'good',
    firmwareVersion: 'v2.4.12',
    lastSyncTime: 'เมื่อ 5 นาทีที่แล้ว',
    sensorCalibration: {
      accelerometer: true,
      gyroscope: true,
      barometer: false,
      opticalHeartRate: true
    }
  },
  {
    deviceId: 'CB-X9903',
    elderId: 'elder-3',
    connectionStatus: 'connected',
    batteryLevel: 45,
    isCharging: true,
    signalStrength: 'fair',
    firmwareVersion: 'v2.4.10',
    lastSyncTime: 'เมื่อ 3 นาทีที่แล้ว',
    sensorCalibration: {
      accelerometer: true,
      gyroscope: true,
      barometer: true,
      opticalHeartRate: true
    }
  }
];
