import { useState, useEffect } from 'react';
import {
  HeartPulse,
  User,
  MapPin,
  ShieldAlert,
  Activity,
  History,
  Info,
  Sliders,
  ChevronRight,
  LogOut,
  Sparkles,
  Menu,
  X,
  Phone,
  Battery,
  AlertTriangle,
  FileText,
  Clock,
  Footprints
} from 'lucide-react';
import { UserSession, Elder, HealthStats, WristbandDevice, AlertLog, GPSCheckpoint } from './types';
import { mockElders, mockHealthStats, mockGPSPaths, mockAlertHistory, mockDevices } from './mockData';

// Import newly created sub-views
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import ElderInfoView from './components/ElderInfoView';
import GPSTrackingView from './components/GPSTrackingView';
import FallDetectionView from './components/FallDetectionView';
import EmergencyAlertView from './components/EmergencyAlertView';
import HealthStatsView from './components/HealthStatsView';
import AlertHistoryView from './components/AlertHistoryView';
import DeviceMgmtView from './components/DeviceMgmtView';
import ReportsSummaryView from './components/ReportsSummaryView';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedElderId, setSelectedElderId] = useState<string>('elder-1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // App live states populated from mock databases
  const [elders, setElders] = useState<Elder[]>(mockElders);
  const [healthStats, setHealthStats] = useState<Record<string, HealthStats>>(mockHealthStats);
  const [gpsPaths, setGpsPaths] = useState<Record<string, GPSCheckpoint[]>>(mockGPSPaths);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>(mockAlertHistory);
  const [devices, setDevices] = useState<WristbandDevice[]>(mockDevices);
  
  // Simulated State for Active emergency
  const [activeFallAlert, setActiveFallAlert] = useState<AlertLog | null>(null);

  // Auto-fill session if needed or let the user choose
  // In our code we let them click quick login on LoginView.

  // Real-time loop simulation to mimic live wristband signals
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      // 1. Gently fluctuate heart rate in state for the active selected elder
      setHealthStats(prev => {
        const currentStats = prev[selectedElderId];
        if (!currentStats) return prev;
        
        let change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        let nextRate = currentStats.avgHeartRate + change;
        if (nextRate < 60) nextRate = 60;
        if (nextRate > 105) nextRate = 105;

        return {
          ...prev,
          [selectedElderId]: {
            ...currentStats,
            avgHeartRate: nextRate,
            maxHeartRate: nextRate > currentStats.maxHeartRate ? nextRate : currentStats.maxHeartRate,
            minHeartRate: nextRate < currentStats.minHeartRate ? nextRate : currentStats.minHeartRate
          }
        };
      });

      // 2. Increment step counters randomly to look alive
      setHealthStats(prev => {
        const currentStats = prev[selectedElderId];
        if (!currentStats) return prev;
        return {
          ...prev,
          [selectedElderId]: {
            ...currentStats,
            stepsCount: currentStats.stepsCount + Math.floor(Math.random() * 3) // 0 to 2 steps increase
          }
        };
      });

      // 3. Slowly drain or fluctuate battery level for active device
      setDevices(prev => {
        return prev.map(dev => {
          if (dev.elderId === selectedElderId && !dev.isCharging) {
            // High drain if active emergency alert
            let drain = activeFallAlert && activeFallAlert.elderId === selectedElderId ? 2 : 0.1;
            let nextBattery = Math.max(dev.batteryLevel - drain, 1);
            return {
              ...dev,
              batteryLevel: parseFloat(nextBattery.toFixed(1))
            };
          }
          return dev;
        });
      });

    }, 5000);

    return () => clearInterval(interval);
  }, [session, selectedElderId, activeFallAlert]);

  // Utility to handle triggers for FALL SIMULATION (sandbox playground)
  const handleTriggerSimulateFall = () => {
    const currentElder = elders.find(e => e.id === selectedElderId) || elders[0];
    
    // Create new urgent fall alert
    const newAlert: AlertLog = {
      id: `alert-sim-${Math.floor(Math.random() * 1000 + 100)}`,
      elderId: currentElder.id,
      elderName: currentElder.name,
      type: 'fall',
      severity: 'critical',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      details: 'ตรวจพบแรงกระแทกกระทันหัน 4.5G ตามด้วยไม่มีสัญญานระนาบขยับ (AI Fall Sensor)',
      status: 'pending'
    };

    // Prepend to alerts list
    setAlertLogs(prev => [newAlert, ...prev]);
    // Set active alert context to trigger HUD
    setActiveFallAlert(newAlert);
    // Switch to emergency view tab immediately to show action!
    setCurrentTab('emergency_alert');
    setMobileMenuOpen(false);
  };

  // Callback from alert resolve buttons
  const handleResolveAlert = (alertId: string, author: string, note: string) => {
    // 1. Update the resolved state inside history logs
    setAlertLogs(prev => {
      return prev.map(log => {
        if (log.id === alertId) {
          return {
            ...log,
            status: 'resolved',
            resolvedBy: author,
            resolvedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            resolutionNote: note
          };
        }
        return log;
      });
    });

    // 2. Clear Active emergency HUD
    if (activeFallAlert && activeFallAlert.id === alertId) {
      setActiveFallAlert(null);
    }

    // Return to dashboard
    setCurrentTab('dashboard');
  };

  const handleResolvePastPendingLog = (logId: string, author: string, note: string) => {
    setAlertLogs(prev => {
      return prev.map(log => {
        if (log.id === logId) {
          return {
            ...log,
            status: 'resolved',
            resolvedBy: author,
            resolvedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            resolutionNote: note
          };
        }
        return log;
      });
    });

    // Also clear active emergency if matching
    if (activeFallAlert && activeFallAlert.id === logId) {
      setActiveFallAlert(null);
    }
  };

  // Updates from caregiver form
  const handleUpdateElderContacts = (elderId: string, updatedContacts: any[]) => {
    setElders(prev => prev.map(e => e.id === elderId ? { ...e, emergencyContacts: updatedContacts } : e));
  };

  // Upgrade OTA inside hardware
  const handleUpdateDeviceFirmware = (deviceId: string, newVersion: string) => {
    setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, firmwareVersion: newVersion } : d));
  };

  // Log out session
  const handleLogCircleOut = () => {
    setSession(null);
    setCurrentTab('dashboard');
    setActiveFallAlert(null);
  };

  // Find active variables based on selection
  const activeElder = elders.find(e => e.id === selectedElderId) || elders[0];
  const activeStats = healthStats[selectedElderId] || healthStats['elder-1'];
  const activeGPS = gpsPaths[selectedElderId] || gpsPaths['elder-1'];
  const activeDevice = devices.find(d => d.elderId === selectedElderId) || devices[0];

  // If no logged in session, render LOGIN PAGE
  if (!session) {
    return <LoginView onLoginSuccess={(user) => setSession(user)} />;
  }

  // Sidebar Tabs navigation elements list
  const sidebarTabs = [
    { id: 'dashboard', label: 'หน้าแดชบอร์ด (Dashboard)', icon: <Activity className="w-4 h-4" /> },
    { id: 'elder_info', label: 'ข้อมูลผู้สูงอายุ (Elder Info)', icon: <User className="w-4 h-4" /> },
    { id: 'gps_tracking', label: 'ติดตามตำแหน่ง (GPS Map)', icon: <MapPin className="w-4 h-4" /> },
    { id: 'fall_detection', label: 'ระบบตรวจจับหกล้ม (Sensor)', icon: <Sliders className="w-4 h-4" /> },
    {
      id: 'emergency_alert',
      label: 'แจ้งเตือนสถานการณ์ (SOS)',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: activeFallAlert ? '🔴 เกิดเหตุ!' : undefined
    },
    { id: 'health_stats', label: 'สถิติสัญญานชีพ (Health)', icon: <Footprints className="w-4 h-4" /> },
    { id: 'alert_history', label: 'ประวัติสายเรียกเข้า (Logs)', icon: <History className="w-4 h-4 animate-pulse-slow" /> },
    { id: 'device_mgmt', label: 'เชื่อมต่อสายรัด (Band)', icon: <Battery className="w-4 h-4" /> },
    { id: 'reports_summary', label: 'สรุปรายงานผล (Reports)', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div id="careband-app-container" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Dynamic Header simulation playground for testing */}
      <header id="app-developer-header" className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs z-30">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4.5 h-4.5 text-teal-400 animate-spin" />
          <span className="font-bold letter bg-teal-500/15 text-teal-300 px-2.5 py-0.5 rounded border border-teal-500/20">
            ระบบจำลองเครื่องทดสอบ (Simulator Mode)
          </span>
          <span className="text-slate-450 hide-on-mobile hidden lg:inline">| คลิกจำลองเหตุการณ์เพื่อติดตามพารามิเตอร์</span>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-slate-400 font-medium">แผงจำลองความเร่งด่วน:</span>
          
          <button
            id="sim-trigger-fall-top-btn"
            onClick={handleTriggerSimulateFall}
            className="px-3 py-1 bg-red-650 hover:bg-red-700 text-white font-extrabold rounded-lg transition-transform hover:scale-105 cursor-pointer shadow-red-500/10 flex items-center gap-1 text-[11px]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            🚨 จำลองหกล้ม {activeElder.name} (Fall)
          </button>

          <button
            id="sim-hr-top-btn"
            onClick={() => {
              // Spike HR up to simulate palpitations
              setHealthStats(p => {
                const cur = p[selectedElderId];
                return { ...p, [selectedElderId]: { ...cur, avgHeartRate: 114 } };
              });
              alert('จำลอง: อัตราหัวใจของของคนไข้ถูกจำลองขึ้นเป็น 114 bpm สำหรับตัวตรวจจับเตือนชีพจรเร็ว');
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg text-[10px] cursor-pointer"
          >
            💓 ชีพจรแรง (114bpm)
          </button>

          <button
            id="sim-steps-top-btn"
            onClick={() => {
              setHealthStats(p => {
                const cur = p[selectedElderId];
                return { ...p, [selectedElderId]: { ...cur, stepsCount: cur.stepsCount + 250 } };
              });
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-[10px] cursor-pointer"
          >
            👣 เพิ่ม 250 ก้าวเดิน
          </button>
        </div>
      </header>

      {/* Primary body divider */}
      <div id="app-workspace-body" className="flex-grow flex flex-col md:flex-row">
        
        {/* Desktop Sidebar Navigation (Requirement targets) */}
        <aside id="desktop-sidebar-nav" className="hidden md:flex md:w-64 bg-slate-900 text-slate-300 flex-col justify-between border-r border-slate-800 relative z-10 shrink-0">
          
          <div className="space-y-6 py-4">
            {/* User Session profile badge */}
            <div className="px-4 py-2 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white rounded-xl flex items-center justify-center font-bold font-sans">
                  {session.role === 'caregiver' ? 'ญาติ' : 'อสม'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-400">เข้าใช้งานสำเร็จ</h4>
                  <p className="text-sm font-black text-slate-100 truncate w-36 leading-normal mt-0.5">{session.name}</p>
                </div>
              </div>

              {session.role === 'vol_health' && (
                <div className="mt-3.5 bg-slate-800 p-2 rounded-lg border border-slate-700 text-[10px] text-emerald-300 font-bold">
                  📍 รับผิดชอบ: เขตหมู่บ้านแสนสุข (หมู่ 3-5)
                </div>
              )}
            </div>

            {/* Menu List of tabs */}
            <nav className="space-y-1 px-2.5">
              {sidebarTabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    id={`sidebar-tab-${tab.id}-btn`}
                    key={tab.id}
                    onClick={() => {
                      setCurrentTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-800 to-teal-900 border border-teal-700 text-white shadow-inner font-bold'
                        : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </span>
                    {tab.badge && (
                      <span className="bg-red-500 text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full animate-pulse">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Log out button */}
          <div className="p-4 border-t border-slate-800">
            <button
              id="sidebar-logout-btn"
              onClick={handleLogCircleOut}
              className="w-full py-2 bg-slate-850 hover:bg-rose-900/40 text-slate-400 hover:text-white border border-slate-800 hover:border-rose-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบวิทยุ
            </button>
            <div className="text-center text-[9px] text-slate-500 mt-3 font-mono">
              CareBand Monitor v2.1.0-C
            </div>
          </div>
        </aside>

        {/* Mobile Header and Hamburg navigation element */}
        <div id="mobile-top-header" className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800 z-10 shrink-0">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-6 h-6 text-emerald-400 animated-pulse" />
            <span className="font-extrabold tracking-tight text-md">CareBand</span>
          </div>

          <div className="flex items-center space-x-2">
            {activeFallAlert && (
              <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md animate-ping">
                พิกัดล้ม!
              </span>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide drawer */}
        {mobileMenuOpen && (
          <div id="mobile-menu-drawer" className="md:hidden bg-slate-900 text-slate-300 border-b border-slate-800 p-4 space-y-4 absolute left-0 right-0 top-[110px] sm:top-[90px] z-20 shadow-2xl animate-in slide-in-from-top-4 duration-250">
            <div className="flex items-center space-x-3.5 border-b border-slate-800 pb-3">
              <span className="w-9 h-9 bg-teal-500 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                U
              </span>
              <div>
                <span className="text-[10px] text-teal-400 block font-bold">ล็อกอินผู้ดูแล</span>
                <span className="font-bold text-xs text-slate-200 block">{session.name}</span>
              </div>
            </div>

            <nav className="grid grid-cols-1 gap-1.5">
              {sidebarTabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    id={`mobile-tab-${tab.id}-btn`}
                    key={tab.id}
                    onClick={() => {
                      setCurrentTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold ${
                      isActive
                        ? 'bg-teal-800 text-white font-bold'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </span>
                    {tab.badge && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <button
              id="mobile-logout-btn"
              onClick={handleLogCircleOut}
              className="w-full py-2 bg-slate-800 hover:bg-rose-900 text-xs font-bold text-center rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        )}

        {/* Main Workspace content viewport rendering tabs */}
        <main id="app-main-viewport" className="flex-grow p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          {/* Custom Section Title and Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold mb-1">
                <span>ระบบศูนย์ข้อมูล CareBand</span>
                <span>/</span>
                <span className="text-teal-600 font-bold capitalize">{currentTab.replace('_', ' ')}</span>
              </div>
              <h1 id="tab-primary-heading" className="text-2xl font-black text-slate-800 leading-tight">
                {currentTab === 'dashboard' && 'หน้าแผงควบคุมหลัก (Active Dashboard)'}
                {currentTab === 'elder_info' && `สมุดประมวลภาพประวัติส่วนตัว: ${activeElder.name}`}
                {currentTab === 'gps_tracking' && `ติดตามตำแหน่งและประวัติการเดินทางคู่ขนาน: ${activeElder.name}`}
                {currentTab === 'fall_detection' && 'วิเคราะห์มวลกายและเซนเซอร์แรงหกล้มด้วย AI'}
                {currentTab === 'emergency_alert' && 'ศาลากลางเหตุแจ้งเตือนพยุงฟื้นตัวระดับปฏิบัติการ'}
                {currentTab === 'health_stats' && `ดัชนีชีพจร อัตราก้าวเดิน และตารางนอนหลับ: ${activeElder.name}`}
                {currentTab === 'alert_history' && 'สมุดประวัติบันทึกสถานการณ์และการเยียวยา'}
                {currentTab === 'device_mgmt' && `การจัดตั้งค่าและปรับตัวรับอุปกรณ์สายรัด: ${activeDevice.deviceId}`}
                {currentTab === 'reports_summary' && 'การออกเอกสารลัทธิสุขภาพและส่งต่อใบรับรองแพทย์'}
              </h1>
            </div>

            {/* Quick stats indicators in page corner */}
            {currentTab !== 'dashboard' && (
              <div className="flex items-center space-x-3.5 text-xs font-medium bg-white px-4 py-2 border border-slate-150 rounded-xl shadow-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {activeElder.name} (อายุ {activeElder.age})
                </span>
                <span className="text-slate-205">|</span>
                <span className="flex items-center gap-1">
                  💓 <b>{activeStats.avgHeartRate}</b> bpm
                </span>
              </div>
            )}
          </div>

          {/* RENDER ACTIVE TAB */}
          <div id="dynamic-viewport-container" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentTab === 'dashboard' && (
              <DashboardView
                elder={activeElder}
                stats={activeStats}
                device={activeDevice}
                activeFallAlert={activeFallAlert}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                eldersList={elders}
                onSelectElder={(id) => {
                  setSelectedElderId(id);
                  setMobileMenuOpen(false);
                }}
                onSimulateFall={handleTriggerSimulateFall}
              />
            )}

            {currentTab === 'elder_info' && (
              <ElderInfoView
                elder={activeElder}
                onUpdateElderContacts={handleUpdateElderContacts}
              />
            )}

            {currentTab === 'gps_tracking' && (
              <GPSTrackingView
                elder={activeElder}
                path={activeGPS}
              />
            )}

            {currentTab === 'fall_detection' && (
              <FallDetectionView
                elder={activeElder}
                onSimulateFall={handleTriggerSimulateFall}
              />
            )}

            {currentTab === 'emergency_alert' && (
              <EmergencyAlertView
                elder={activeElder}
                activeAlert={activeFallAlert}
                onResolveAlert={handleResolveAlert}
                onSimulateFall={handleTriggerSimulateFall}
              />
            )}

            {currentTab === 'health_stats' && (
              <HealthStatsView
                stats={activeStats}
              />
            )}

            {currentTab === 'alert_history' && (
              <AlertHistoryView
                logs={alertLogs}
                onResolvePendingLog={handleResolvePastPendingLog}
                eldersList={elders}
              />
            )}

            {currentTab === 'device_mgmt' && (
              <DeviceMgmtView
                device={activeDevice}
                onUpdateDeviceFirmware={handleUpdateDeviceFirmware}
              />
            )}

            {currentTab === 'reports_summary' && (
              <ReportsSummaryView
                elder={activeElder}
                stats={activeStats}
              />
            )}
          </div>

        </main>
      </div>

    </div>
  );
}
