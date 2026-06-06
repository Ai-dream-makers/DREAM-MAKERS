import { useState, useEffect } from 'react';
import { ShieldCheck, Flame, Sliders, Play, AlertCircle, Info, Cpu, RefreshCw, BarChart2 } from 'lucide-react';
import { Elder } from '../types';

interface FallDetectionViewProps {
  elder: Elder;
  onSimulateFall: () => void;
}

export default function FallDetectionView({ elder, onSimulateFall }: FallDetectionViewProps) {
  const [waveOffset, setWaveOffset] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationSuccess, setCalibrationSuccess] = useState(true);

  // Animate accelerometer wave lines in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setWaveOffset(prev => (prev + 5) % 360);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // Generate sine wave coordinates for SVG live telemetry simulation
  const generateWavePath = (offset: number, amplitude: number, phase: number, noise = 0) => {
    let path = 'M 0 50';
    for (let x = 0; x <= 400; x += 10) {
      const angle = ((x + offset + phase) * Math.PI) / 180;
      const y = 50 + Math.sin(angle) * amplitude + (Math.sin(angle * 3) * noise);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibrationSuccess(true);
    }, 1500);
  };

  return (
    <div id="fall-detection-view" className="space-y-6">
      
      {/* 2 Column configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand: Accelerometer/Gyroscope Live Telemetry (หน้าสถูปวิทยุเซนเซอร์) */}
        <div id="fall-telemetry-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Cpu className="w-5 h-5 text-rose-500" />
              คลื่นวิเคราะห์คลื่นไหว (3-Axis High-G Telemetry Feed)
            </h3>
            
            <span className="text-[10px] bg-slate-900 text-slate-200 px-2 py-0.5 rounded-md font-mono font-bold tracking-widest">
              SAMPLING RATE: 100Hz
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            กราฟประมวลภาพสัญญาณความดัน แรงสัมพัทธ์ และแรงโน้มถ่วงแบบต่อเนื่อง ถอดรหัสผ่านเซนเซอร์วัดการขยับไหวแบบเรียลไทม์ เพื่อป้อนข้อมูลประเมินโครงข่ายประสาทเทียมตรวจจับจุดสัมผัสล้มกระแทกพื้น
          </p>

          {/* Graphical custom SVG waves representing X, Y, Z vectors */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
            
            {/* HUD Header */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>เซนเซอร์: ACCELEROMETER STYLUS 4.0</span>
              <span className="text-emerald-400">● LIVE FEED</span>
            </div>

            {/* Custom SVG Drawing waves */}
            <div className="h-32 w-full flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="20" x2="400" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />

                {/* X-Axis Wave (Rose/Red) */}
                <path
                  d={generateWavePath(waveOffset, 15, 0)}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  className="opacity-95"
                />

                {/* Y-Axis Wave (Green) */}
                <path
                  d={generateWavePath(waveOffset, 10, 120, 2)}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  className="opacity-90"
                />

                {/* Z-Axis Wave (Sky Blue) */}
                <path
                  d={generateWavePath(waveOffset, 8, 240, 1)}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  className="opacity-90"
                />
              </svg>
              
              {/* Overlay HUD indicators */}
              <div className="absolute top-2 right-2 text-[9px] font-mono space-y-1 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="block text-rose-500">X-Axis: 0.12G (ปกติ)</span>
                <span className="block text-emerald-400">Y-Axis: 0.98G (แรงโน้มถ่วง)</span>
                <span className="block text-sky-400">Z-Axis: 0.04G (เสถียร)</span>
              </div>
            </div>

            {/* Accent legends */}
            <div className="flex justify-center space-x-6 text-[10px] font-semibold text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-rose-500 rounded"></span>แกน X (แรงกระทบขวาง)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-emerald-500 rounded"></span>แกน Y (แรงตกแนวดิ่ง)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-sky-500 rounded"></span>แกน Z (แรงเหวี่ยงเคลื่อนตัว)</span>
            </div>

          </div>

          {/* Smart calibrations utilities */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-700">ลื่นพิกัดตัวแปรจับการล่วงละเมิดล้ม (Accelerometer Calibration)</span>
              <p className="text-slate-400 text-[11px]">ปรับมุมชดเชยการลาดเอียงขณะเดินเพื่อให้หุ่นยนต์วิเคราะห์ล้มได้แม่นยำสูงขึ้น</p>
            </div>

            <button
              id="recalibrate-btn"
              onClick={handleRecalibrate}
              disabled={isCalibrating}
              className={`py-2 px-4 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                isCalibrating
                  ? 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
              {isCalibrating ? 'กำลังปรับเทียบ...' : 'เริ่มตั้งค่าวิเคราะห์ระดับน้ำ'}
            </button>
          </div>

        </div>

        {/* Right Hand: AI Analysis & Risk evaluations (หน้าประเมินระดับความเสี่ยงของสมองกล) */}
        <div id="fall-ai-analysis-card" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <BarChart2 className="w-4.5 h-4.5 text-teal-600" />
                การประเมินความเสี่ยงอุบัติเหตุ (AI Risk Matrix)
              </h3>
            </div>

            {/* Risk Index gauges */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">คะแนนและดัชนีระบุความเสี่ยง</span>
              
              <div className="space-y-4">
                {/* Low Risk Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>ความเสี่ยงต่ำสุด (ไม่มีอุบัติเหตุ)</span>
                    <span className="text-emerald-600">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                {/* Medium Risk Bar (Stumble alerts) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>ประวัติชะงักไถลตัว (Stumble risks)</span>
                    <span className="text-amber-600">6%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '6%' }}></div>
                  </div>
                </div>

                {/* High Risk Bar (Sudden high G contact) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>ตระหนกการหกล้มเฉียบพลัน (Severe impact)</span>
                    <span className="text-rose-600">2%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '2%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI analytical conclusion box */}
            <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl space-y-1 text-xs text-teal-800">
              <b className="font-bold block text-teal-900">สรุปผลพยากรณ์โครงสร้างทางกล:</b>
              <p className="leading-relaxed">
                โมเดลทำนายการกระทำของผู้สวมใส่ <b className="text-teal-900">{elder.name}</b> ปัจจุบันระบุท่าทาง: 🚶‍♂️ <b>การก้าวเดินปกติสมดุล</b> ระบบสแกนเชิงก้าวชี้ว่าประพฤติกรรมมีความสมมาตรของขา สัมพันธ์กับการประคองตัวที่ดีมาก
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              id="simulate-fall-direct-btn"
              onClick={onSimulateFall}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="w-4.5 h-4.5" />
              จำลองกล่องเซนเซอร์รับแรงสะเทือนสูง หกล้มด่วน!
            </button>
            <p className="text-[10px] text-center text-slate-400">
              * การกดปุ่มด้านบนจะจำลองสัญญาณล้ม ส่งจังหวะกระตุ้นระบบเหตุการณ์และเบอร์เสียงติดต่อหน่วยกู้ชีพทันที
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
