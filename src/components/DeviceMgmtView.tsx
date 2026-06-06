import { useState } from 'react';
import { Cpu, Wifi, Battery, RefreshCw, Layers, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { WristbandDevice } from '../types';

interface DeviceMgmtViewProps {
  device: WristbandDevice;
  onUpdateDeviceFirmware: (deviceId: string, newVersion: string) => void;
}

export default function DeviceMgmtView({ device, onUpdateDeviceFirmware }: DeviceMgmtViewProps) {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(device.firmwareVersion === 'v2.4.10' || device.firmwareVersion === 'v2.4.12');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateAvailable(true);
      alert('ระบบตรวจสอบความมั่นคงพบระบบปฏิบัติการเวอร์ชันใหม่: v2.4.14 พร้อมให้บริการอัปเดตผ่านคลาวด์');
    }, 1200);
  };

  const handleInstallUpdate = () => {
    setIsUpdating(true);
    setUpdateProgress(10);
    
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          setUpdateAvailable(false);
          onUpdateDeviceFirmware(device.deviceId, 'v2.4.14');
          alert(`อัปเดตระบบปฏิบัติการสายรัดข้อมือ ${device.deviceId} สำเร็จเป็นรุ่นคลังอารักษ์ v2.4.14 เรียบร้อย!`);
          return 0;
        }
        return prev + 15;
      });
    }, 400);
  };

  const getSignalBadge = (strength: string) => {
    if (strength === 'excellent') return <span className="bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-150 rounded-lg text-xs font-bold">5G • ยอดเยี่ยม</span>;
    if (strength === 'good') return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 border border-emerald-100 rounded-lg text-xs font-bold">4G • เสถียร</span>;
    return <span className="bg-amber-50 text-amber-700 px-3 py-1 border border-amber-100 rounded-lg text-xs font-bold">3G • ปานกลาง</span>;
  };

  return (
    <div id="device-mgmt-view" className="space-y-6">
      
      {/* 2 Column Grid split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left hand details diagnostic */}
        <div id="device-diagnostic-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Cpu className="w-5 h-5 text-teal-600" />
              การวินิจฉัยสุขภาพฮาร์ดแวร์ข้อมือ (IoT Device Diagnostics)
            </h3>
            
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              ● เชื่อมต่อสด
            </span>
          </div>

          {/* Quick specs grid representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
              <p>📱 <b>หมายเลขอุปกรณ์ฮาร์ดแวร์:</b> <span className="font-mono font-bold text-slate-700">{device.deviceId}</span></p>
              <p>🔋 <b>แบตเตอรี่ในวงจร:</b> <span className="font-bold text-slate-800">{device.batteryLevel}%</span> ({device.isCharging ? 'เสียบสายชาร์จอยู่' : 'คายพลังงานปกติ'})</p>
              <p>🛜 <b>ผู้บริการ SIM เครือข่าย:</b> CAT-IoT NB-IoT Band 8</p>
              <p>⏳ <b>การเทียบข้อมูลหลัง:</b> {device.lastSyncTime}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">การสื่อสาร & ความแรงคลื่น</span>
              <div className="flex items-center justify-between">
                <span>อัตราการรับส่งข้อมูล (Ping Rate)</span>
                <span className="font-bold font-mono">12 ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ความเข้มคลื่นวิทยุ (RSSI)</span>
                {getSignalBadge(device.signalStrength)}
              </div>
            </div>
          </div>

          {/* Calibrations check diagnostic checklists requested visually */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">สถานะความพร้อมตัวรับวัดเซนเซอร์ (Integrated Gyro Calibration Check)</span>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center space-x-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                <span className="font-semibold text-slate-700">3-Axis Accel</span>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center space-x-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                <span className="font-semibold text-slate-700">Gyroscope</span>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center space-x-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                <span className="font-semibold text-slate-700">Heart Rate</span>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center space-x-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                <span className="font-semibold text-slate-700">Geofence SIM</span>
              </div>

            </div>
          </div>

        </div>

        {/* Right hand OAT (Over the air) firmware dynamic update panel */}
        <div id="device-ota-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <RefreshCw className="w-4.5 h-4.5 text-teal-600" />
                ฟังก์ชันการอัปเดตระบบปฏิบัติการ (Over-The-Air OTA)
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-650">
              <div className="flex justify-between">
                <span>รุ่นเฟิร์มแวร์ปัจจุบัน:</span>
                <span className="font-mono font-bold text-slate-800">{device.firmwareVersion}</span>
              </div>
              <div className="flex justify-between">
                <span>สเถียรภาพระบบปฏิบัติการ:</span>
                <span className="text-emerald-600 font-bold">ระดับสมบูรณ์ที่สุด</span>
              </div>
            </div>

            {/* Over the air system actions bar */}
            {isUpdating ? (
              <div id="firmware-progress-hud" className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                <div className="flex justify-between text-xs font-bold text-teal-600">
                  <span>กำลังดาวน์โหลดไฟล์ติดตั้งเวอร์ชันใหม่...</span>
                  <span>{updateProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400">กรุณาอย่าวางข้อมือห่างจากมือถือหรือห้ามปิดสัญญาณเน็ตเวิร์ก</p>
              </div>
            ) : updateAvailable ? (
              <div id="ota-notice-banner" className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-3">
                <b className="text-xs font-bold text-emerald-900 block">✨ มีแพตช์อัปเดตใหม่ v2.4.14!</b>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  แก้ไขการประหยัดพลังงานแบตเตอรี่ในโหมดหลับลึก พร้อมปรับปรุงความแม่นยำเซนเซอร์หกล้มขึ้นอีก 15% 
                </p>
                <button
                  id="install-update-btn"
                  onClick={handleInstallUpdate}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer font-sans"
                >
                  🚀 อัปเดตผ่านอวกาศสู่สายรัดข้อมือด่วน (OTA Upgrade Now)
                </button>
              </div>
            ) : (
              <div id="ota-uptodate-banner" className="p-3.5 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                ✔️ ซอฟต์แวร์เครื่องรับสัญญาณชีพเป็นรุ่นล่าสุดเรียบร้อยแล้ว
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-105 space-y-2.5">
            {!isUpdating && !updateAvailable && (
              <button
                id="check-update-btn"
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                {isCheckingUpdate ? 'กำลังตรวจเช็ค...' : 'ค้นหาการอัปเดตใหม่ล่าสุด'}
              </button>
            )}
            <p className="text-[9.5px] text-slate-450 text-center">
              สายรัดข้อมือรองรับสัญญาลดการใช้พลังงานเพื่อยืดอายุการรัดได้นานถึง 14 วันต่อการชาร์จ 1 ครั้ง
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
