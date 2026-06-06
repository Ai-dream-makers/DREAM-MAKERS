import { HeartPulse, Battery, MapPin, ShieldAlert, Navigation, Footprints, AlertTriangle, Activity, Wifi, CheckCircle2 } from 'lucide-react';
import { Elder, HealthStats, WristbandDevice } from '../types';

interface DashboardViewProps {
  elder: Elder;
  stats: HealthStats;
  device: WristbandDevice;
  activeFallAlert: any;
  onNavigateTab: (tab: string) => void;
  eldersList: Elder[];
  onSelectElder: (id: string) => void;
  onSimulateFall: () => void;
}

export default function DashboardView({
  elder,
  stats,
  device,
  activeFallAlert,
  onNavigateTab,
  eldersList,
  onSelectElder,
  onSimulateFall
}: DashboardViewProps) {
  
  // Calculate battery color and text
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (level > 20) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-rose-500 bg-rose-50 border-rose-100 animate-pulse';
  };

  // Get dynamic Safety Status Title
  const isEmergency = activeFallAlert && activeFallAlert.elderId === elder.id;

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Elder list quick switcher at top */}
      <div id="elder-switcher-container" className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              คุณกำลังติดตามผู้สูงอายุในความดูแล
            </h4>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              เลือกรายชื่อผู้สูงอายุเพื่อดูรายงานและข้อมูลสายรัดข้อมือเรียลไทม์
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {eldersList.map((e) => {
              const actsAlert = activeFallAlert && activeFallAlert.elderId === e.id;
              return (
                <button
                  id={`select-elder-${e.id}-btn`}
                  key={e.id}
                  onClick={() => onSelectElder(e.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-150 flex items-center space-x-2 cursor-pointer ${
                    elder.id === e.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : actsAlert
                      ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100/50 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    actsAlert ? 'bg-red-500 animate-ping' : elder.id === e.id ? 'bg-emerald-400' : 'bg-slate-300'
                  }`}></span>
                  <span>{e.name}</span>
                  <span className="text-[10px] opacity-70">({e.age} ปี)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Alert Banner if simulated emergency is active on CURRENT selected elder */}
      {isEmergency && (
        <div id="dashboard-emergency-banner" className="bg-red-50 border-2 border-red-500/50 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="inline-block bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                ฉุกเฉิน • ตรวจพบแรงล้มกระแทก!
              </span>
              <h3 className="text-lg font-bold text-red-900">{elder.name} หกล้มเมื่อสักครู่</h3>
              <p className="text-sm text-red-700 mt-0.5">
                เวลาตรวจพบ: วันนี้ สัญญาณวิเคราะห์แรงกระแทกจากสายรัดข้อมือยืนยันวิกฤต กรุณาช่วยเหลือด่วน!
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              id="dash-go-alert-btn"
              onClick={() => onNavigateTab('emergency_alert')}
              className="flex-1 md:flex-initial text-center py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              ดูรายละเอียด & ติดต่อหน่วยกู้ชีพ
            </button>
            <button
              id="dash-dismiss-alert-btn"
              onClick={() => onNavigateTab('alert_history')}
              className="flex-1 md:flex-initial text-center py-2.5 px-4 bg-white hover:bg-red-100 border border-red-300 text-red-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              เขียนบันทึกช่วยเหลือ
            </button>
          </div>
        </div>
      )}

      {/* Grid of Realtime Cards requested: ชีพจร แบตเตอรี่ ตำแหน่ง และสถานะความปลอดภัย */}
      <div id="dashboard-realtime-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: ชีพจร (Heart Rate) */}
        <div
          id="dash-card-heart"
          onClick={() => onNavigateTab('health_stats')}
          className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ชีพจรหัวใจ (Pulse)</span>
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-100 transition-colors">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          
          <div className="mt-4 flex items-baseline space-x-2">
            <span id="dash-heart-val" className="text-4xl font-extrabold text-slate-800 tracking-tight font-sans">
              {stats?.avgHeartRate || 72}
            </span>
            <span className="text-sm font-semibold text-slate-400">bpm</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              สัญญาณปกติ
            </span>
            <span className="text-xs text-slate-400 font-mono">ช่วงเลนส์ {stats?.minHeartRate || 60}-{stats?.maxHeartRate || 110}</span>
          </div>
        </div>

        {/* Card 2: แบตเตอรี่ (Wristband Battery) */}
        <div
          id="dash-card-battery"
          onClick={() => onNavigateTab('device_mgmt')}
          className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">แบตเตอรี่ (Battery)</span>
            <div className={`p-2 rounded-xl transition-colors ${getBatteryColor(device.batteryLevel)}`}>
              <Battery className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-4 flex items-baseline space-x-1.5">
            <span id="dash-battery-val" className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {device.batteryLevel}%
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase">
              {device.isCharging ? '• ชาร์จอยู่' : '• ยังไม่ชาร์จ'}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center">
              <Wifi className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              เชื่อมต่อเสถียร
            </span>
            <span>{device.lastSyncTime}</span>
          </div>
        </div>

        {/* Card 3: ตำแหน่ง (GPS Location) */}
        <div
          id="dash-card-location"
          onClick={() => onNavigateTab('gps_tracking')}
          className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ตำแหน่งปัจจุบัน (GPS)</span>
            <div className="p-2 bg-sky-50 text-sky-500 rounded-xl group-hover:bg-sky-100 transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-3">
            <span id="dash-location-val" className="text-base font-bold text-slate-800 block truncate leading-tight">
              {elder.id === 'elder-1' ? 'บ้านพัก (ซอยแสนสุข 4)' : elder.id === 'elder-2' ? 'บ้านพัก (ต.ดอนทราย)' : 'บ้านพัก (ซอยแสนสุข 2)'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">เขตตาราง: {elder.villageName}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-sky-600 font-semibold group-hover:underline">
            <span className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              กดที่นี่เพื่อเรียกดูพิกัดแผนที่
            </span>
          </div>
        </div>

        {/* Card 4: สถานะความปลอดภัย (Fall/Safety Status) */}
        <div
          id="dash-card-safety"
          onClick={() => onNavigateTab('fall_detection')}
          className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">สถานะความปลอดภัย</span>
            <div className={`p-2 rounded-xl transition-colors ${
              isEmergency ? 'bg-red-50 text-red-500 animate-bounce' : 'bg-emerald-50 text-emerald-500'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-3.5">
            <span id="dash-safety-val" className={`text-xl font-extrabold tracking-tight ${
              isEmergency ? 'text-rose-600' : 'text-emerald-700'
            }`}>
              {isEmergency ? '⚠️ คาดว่าหกล้ม!' : '🟢 ปลอดภัยเต็มกิโล'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">ตัวตรวจวิเคราะห์ AI ประมวลแล้ว</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>ความเสี่ยงวันนี้</span>
            <span className="font-bold text-emerald-600">ต่ำมาก</span>
          </div>
        </div>

      </div>

      {/* Row 2: Secondary Dashboard Information Columns */}
      <div id="dashboard-col2-row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step Progression Column Card */}
        <div id="dash-stat-steps-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">ก้าวเดินวันนี้ (Steps Counter)</h3>
            <Footprints className="w-4 h-4 text-slate-400" />
          </div>

          {/* Graphical gauge represent step goal */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Ring representing 90% */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle cx="72" cy="72" r="60" stroke="#14b8a6" strokeWidth="12" fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - Math.min(stats.stepsCount / stats.stepsTarget, 1))}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2.5xl font-extrabold text-slate-800 tracking-tight">{stats.stepsCount}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เป้าหมาย {stats.stepsTarget}</span>
              </div>
            </div>
            
            <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
              วันนี้เดินสำเร็จแล้ว <b>{Math.round((stats.stepsCount / stats.stepsTarget) * 100)}%</b> ของเป้าหมายสุขภาพสำหรับการบริหารกระดูก
            </p>
          </div>

          <button
            id="dash-view-stats-btn"
            onClick={() => onNavigateTab('health_stats')}
            className="w-full py-2.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/60 hover:bg-slate-100 transition-colors text-center cursor-pointer"
          >
            ดูสถิติสุขภาพอย่างละเอียด
          </button>
        </div>

        {/* Quick Contacts & Care Profile Panel */}
        <div id="dash-care-profile-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">ญาติผู้ดูแล & ข้อมูลติดต่อส่งสัญญาณ</h3>
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-md">อัปเดตสม่ำเสมอ</span>
          </div>

          <div className="my-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={elder.photo}
                alt={elder.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 flex-shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-800">{elder.name}</h4>
                <p className="text-xs text-slate-400">อายุ {elder.age} ปี • โรค: {elder.chronicDiseases?.[0] || 'ไม่มีโรคประจำตัว'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150/70 space-y-1.5 text-xs text-slate-600">
              <p>📍 <b>บ้านพัก:</b> {elder.villageName}</p>
              <p>👨‍👦 <b>ผู้ดูแลหลัก:</b> {elder.primaryCaregiverName}</p>
              <p>📞 <b>โทรฉุกเฉิน ญาติ:</b> {elder.emergencyContacts?.[0]?.phone || 'ไม่ระบุ'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              id="dash-edit-contacts-btn"
              onClick={() => onNavigateTab('elder_info')}
              className="py-2.5 px-3 bg-teal-50 border border-teal-100 text-teal-700 font-semibold text-xs rounded-xl hover:bg-teal-100/50 text-center cursor-pointer transition-colors"
            >
              ดูเบอร์ติดต่อทั้งหมด
            </button>
            <button
              id="dash-simulate-fall-btn"
              onClick={onSimulateFall}
              className="py-2.5 px-3 bg-rose-50 border border-rose-100 text-rose-700 font-semibold text-xs rounded-xl hover:bg-rose-100/50 text-center cursor-pointer transition-colors flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              ทดสอบล้ม (Fall Simulation)
            </button>
          </div>
        </div>

        {/* AI Health Notification Summary panel */}
        <div id="dash-ai-report-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-700">สถานะอุปกรณ์ & การวิเคราะห์เชิงคาดการณ์</h3>
              <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
            </div>

            <div className="my-4 space-y-3">
              <div className="flex items-start space-x-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-800">เซนเซอร์ 3 มิติทำงานปกติ</b>
                  <p className="text-slate-400 text-[11px] mt-0.5">การปรับเทียบ accelerometer สำเร็จครบถ้วน 0.00G offset</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-800">ระบบประเมินภูมิศาสตร์ในจุดกั้น</b>
                  <p className="text-slate-400 text-[11px] mt-0.5">พิกัดปัจจุบันอยู่ภายในโซนปลอดภัยระยะทาง 1 กม. จากจุดที่อยู่หลัก</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-600">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-850">ประวัติความเสี่ยงหกล้มรอบ 7 วัน</b>
                  <p className="text-slate-400 text-[11px] mt-0.5">มีสัญญาณลื่นไถลเล็กน้อย 1 ครั้งเมื่อวาน แต่ทรงตัวได้ทัน ความเสี่ยงระดับต่ำ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="dash-goto-logs-btn"
              onClick={() => onNavigateTab('alert_history')}
              className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all text-center cursor-pointer"
            >
              ดูบันทึกเหตุการณ์ความปลอดภัยย้อนหลัง
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
