import { useState } from 'react';
import { MapPin, Navigation, History, Shield, Info, Sliders, ChevronRight } from 'lucide-react';
import { Elder, GPSCheckpoint } from '../types';

interface GPSTrackingViewProps {
  elder: Elder;
  path: GPSCheckpoint[];
}

export default function GPSTrackingView({ elder, path }: GPSTrackingViewProps) {
  const [geofenceRadius, setGeofenceRadius] = useState(1000); // 1000 meters default
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<GPSCheckpoint | null>(
    path.length > 0 ? path[path.length - 1] : null
  );

  // Simple relative conversion coordinates for SVG simulation based on lat/lng offsets
  const getMapCoordinates = (lat: number, lng: number) => {
    // Arbitrary map coordinates based on realistic offset relative to a center point (13.75, 100.5)
    const centerX = 200;
    const centerY = 150;
    const dx = (lng - 100.50) * 12000;
    const dy = (13.76 - lat) * 12000;
    return {
      x: centerX + dx,
      y: centerY + dy
    };
  };

  return (
    <div id="gps-tracking-view" className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Realistic simulated vector street maps */}
        <div id="gps-map-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Navigation className="w-5 h-5 text-teal-600" />
              แผนที่แสดงตารางพิกัดจำลองภูมิภาค (Simulated Web GIS)
            </h3>
            
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              GPS สัญญาณดีเยี่ยม
            </span>
          </div>

          {/* Interactive SVG Canvas representation of the village */}
          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            
            <svg id="vector-map-canvas" className="w-full h-full absolute inset-0" viewBox="0 0 500 300">
              
              {/* Grid Background Lines for modern HUD aesthetic */}
              <defs>
                <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                <radialGradient id="geofenceGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Safe Circle Geofence boundary, anchored near Home (center 200, 160) */}
              <circle
                id="safe-geofence"
                cx="200"
                cy="160"
                r={geofenceRadius / 10}
                fill="url(#geofenceGradient)"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-60"
              />

              {/* Vector Streets / Highways connecting checkpoints */}
              <path
                d="M 50,220 L 150,180 L 200,160 L 320,100 L 450,110 M 200,160 L 220,50 L 380,40 M 150,180 L 270,250 L 410,210"
                fill="none"
                stroke="#475569"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40"
              />
              <path
                d="M 50,220 L 150,180 L 200,160 L 320,100 L 450,110 M 200,160 L 220,50 L 380,40 M 150,180 L 270,250 L 410,210"
                fill="none"
                stroke="#0e7490"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80"
              />

              {/* Connect checkpoints via past travel history trails line */}
              {path.length > 1 && (
                <polyline
                  points={path.map(pt => {
                    const coord = getMapCoordinates(pt.lat, pt.lng);
                    return `${coord.x},${coord.y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                  className="opacity-90 animate-dash"
                />
              )}

              {/* Markers for key locations */}
              {/* Home Marker */}
              <circle cx="200" cy="160" r="6" fill="#0ea5e9" opacity="0.3" />
              <circle cx="200" cy="160" r="3" fill="#0ea5e9" />
              <text x="210" y="164" fill="#38bdf8" fontSize="9" fontWeight="bold">จุดเริ่มต้น: บ้านพัก</text>

              {/* Place Landmarks according to historical offset */}
              <circle cx="320" cy="100" r="5" fill="#f59e0b" />
              <text x="328" y="104" fill="#fbbf24" fontSize="8" fontWeight="medium">ศาลาประชาคม</text>

              <circle cx="220" cy="50" r="5" fill="#10b981" />
              <text x="228" y="54" fill="#34d399" fontSize="8" fontWeight="medium">วัดโพธิ์ร่มเย็น</text>

              <circle cx="150" cy="180" r="5" fill="#eab308" />
              <text x="140" y="174" fill="#facc15" fontSize="8" fontWeight="medium">ตลาดสด</text>

              {/* Blue pulse background to represent the currently selected GPS node point */}
              {selectedCheckpoint && (() => {
                const coord = getMapCoordinates(selectedCheckpoint.lat, selectedCheckpoint.lng);
                return (
                  <>
                    <circle cx={coord.x} cy={coord.y} r="14" fill="#f43f5e" className="animate-ping" opacity="0.4" />
                    <circle cx={coord.x} cy={coord.y} r="7" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                  </>
                );
              })()}
            </svg>

            {/* Float HUD overlay describing the selected GPS pointer details */}
            <div className="absolute bottom-3 left-3 bg-slate-950/85 text-white backdrop-blur-md p-3 rounded-xl border border-slate-700/60 text-xs w-48 sm:w-64 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">ตำแหน่งที่เลือกดูอยู่</span>
              <p className="font-bold text-slate-100 truncate">{selectedCheckpoint?.locationName}</p>
              <p className="text-slate-400 font-mono text-[10px]">พิกัด: {selectedCheckpoint?.lat.toFixed(4)}, {selectedCheckpoint?.lng.toFixed(4)}</p>
              <span className="inline-block bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md mt-1">เวลาบันทึก: {selectedCheckpoint?.time} น.</span>
            </div>

          </div>

          {/* Interactive controls: geofence settings slider */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Shield className="w-4 h-4 text-emerald-600" />
              <div>
                <b className="text-slate-700">กำหนดรัศมีขอบเขตปลอดภัย (Geofencing Circle)</b>
                <p className="text-slate-400 text-[11px]">หากสายรัดข้อมือออกนอกแนวรัศมี ระบบจะส่งแจ้งเตือนภัยทันที</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-64">
              <span className="text-slate-400 font-bold whitespace-nowrap">300 ม.</span>
              <input
                id="geofence-range-slider"
                type="range"
                min="300"
                max="2500"
                step="50"
                value={geofenceRadius}
                onChange={e => setGeofenceRadius(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
              <span className="text-emerald-700 font-extrabold whitespace-nowrap">{(geofenceRadius / 1000).toFixed(2)} กม.</span>
            </div>
          </div>

        </div>

        {/* Right column: Checklist travel history (ประวัติการเดินทาง) */}
        <div id="gps-timeline-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <History className="w-4.5 h-4.5 text-slate-400" />
              การเดินทางเดินทางวันนี้ (Travel History)
            </h3>
            <span className="text-[10px] px-2 py-0.5 bg-slate-150/65 rounded-md text-slate-500 font-semibold font-mono">
              {path.length}Checkpoint
            </span>
          </div>

          <div className="space-y-4 relative pl-3.5 border-l-2 border-slate-100 py-1.5 max-h-[360px] overflow-y-auto">
            {path.map((item, idx) => (
              <div
                id={`gps-checkpoint-item-${idx}`}
                key={idx}
                onClick={() => setSelectedCheckpoint(item)}
                className={`group relative pl-5 cursor-pointer pb-2 ${
                  idx < path.length - 1 ? 'mb-4' : 'mb-0'
                }`}
              >
                {/* Visual Circle Anchor along left timeline line */}
                <span className={`absolute -left-[23.5px] top-1 w-4 h-4 rounded-full border-2 border-white transition-transform ${
                  selectedCheckpoint === item
                    ? 'bg-rose-500 scale-125 ring-4 ring-rose-100'
                    : 'bg-slate-300 group-hover:bg-slate-400'
                }`}></span>

                <div className="flex justify-between items-baseline gap-1">
                  <h4 className={`text-xs font-bold text-slate-800 ${
                    selectedCheckpoint === item ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {item.locationName}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.time} น.</span>
                </div>
                
                <p className="text-[11px] text-slate-400 mt-1 leading-tight">{item.duration}</p>
                
                <div className="mt-2 text-[10px] font-semibold text-teal-600 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>คลิกเพื่อดูจุดเด่นพิกัดบนแผนที่</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Informative Geofence Status badge */}
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-700 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <p className="leading-relaxed">
              เครื่องหมาย <b className="text-rose-700">จุดสีแดงกระพริบ</b> บนผืนแผนที่ แสดงถึงจุดอ้างอิงพิกัดล่าสุดที่สายรัดข้อมือส่งสัญญาณ Sync เข้าสู่คลาวด์ เพื่อความรวดเร็วในการติดตามตัวกรณีออกนอกบ้าน
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
