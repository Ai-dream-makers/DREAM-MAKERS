export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface Elder {
  id: string;
  name: string;
  age: number;
  gender: 'ชาย' | 'หญิง';
  photo: string;
  chronicDiseases: string[];
  allergies: string[];
  medications: { name: string; dosage: string; schedule: string }[];
  primaryCaregiverName: string;
  emergencyContacts: EmergencyContact[];
  bloodType: string;
  weight: number;
  height: number;
  villageName: string;
}

export interface MetricLog {
  time: string;
  heartRate: number;
  steps: number;
  activity: string;
}

export interface HealthStats {
  stepsCount: number;
  stepsTarget: number;
  avgHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
  sleepHours: number;
  deepSleepPercent: number;
  lightSleepPercent: number;
  weeklySteps: { day: string; count: number }[];
  hourlyHeartRate: { hour: string; rate: number }[];
  sleepHistory: { date: string; hours: number }[];
}

export interface GPSCheckpoint {
  time: string;
  locationName: string;
  lat: number;
  lng: number;
  duration: string;
}

export interface AlertLog {
  id: string;
  elderId: string;
  elderName: string;
  type: 'fall' | 'high_hr' | 'low_hr' | 'out_of_bounds' | 'low_battery';
  severity: 'critical' | 'alert' | 'warning';
  timestamp: string;
  details: string;
  status: 'pending' | 'caregiver_contacted' | 'rescue_dispatched' | 'resolved';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface WristbandDevice {
  deviceId: string;
  elderId: string;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  batteryLevel: number;
  isCharging: boolean;
  signalStrength: 'excellent' | 'good' | 'fair' | 'poor';
  firmwareVersion: string;
  lastSyncTime: string;
  sensorCalibration: {
    accelerometer: boolean;
    gyroscope: boolean;
    barometer: boolean;
    opticalHeartRate: boolean;
  };
}

export interface UserSession {
  email: string;
  role: 'caregiver' | 'vol_health' | 'admin'; // ญาติ / อสม. / ผู้ดูแลระบบ
  name: string;
  villageCode?: string;
}
